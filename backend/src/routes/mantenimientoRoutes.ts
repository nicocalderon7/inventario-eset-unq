import { Router } from 'express';
import { crearMantenimiento, getMantenimientos, getMantenimiento, actualizarMantenimiento, eliminarMantenimiento } from '../controllers/mantenimientoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Mantenimientos
 *     description: Mantenimiento de equipos y sincronizaciÃ³n de su disponibilidad
 * components:
 *   schemas:
 *     MantenimientoDatos:
 *       type: object
 *       properties:
 *         id_equipo:
 *           type: integer
 *           minimum: 1
 *           description: Equipo asociado; no puede cambiarse al actualizar
 *           example: 1
 *         fecha_inicio:
 *           type: string
 *           description: Fecha ISO (YYYY-MM-DD o fecha y hora)
 *           example: '2026-09-10T09:00:00-03:00'
 *         fecha_fin:
 *           type: string
 *           nullable: true
 *           description: Se completa con la fecha actual si falta al completar. Al reabrir se limpia automáticamente.
 *           example: null
 *         repuestos:
 *           type: string
 *           nullable: true
 *           maxLength: 255
 *           example: Fuente de alimentaciÃ³n
 *         descripcion_falla:
 *           type: string
 *           minLength: 1
 *           example: El equipo no enciende
 *         responsable:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: Taller de informÃ¡tica
 *         estado:
 *           type: string
 *           enum: [pendiente, en_progreso, completado]
 *           description: Al crear se usa pendiente si se omite; al actualizar se conserva el estado actual
 *         observaciones:
 *           type: string
 *           nullable: true
 *           example: Revisar la fuente
 *     CrearMantenimiento:
 *       allOf:
 *         - $ref: '#/components/schemas/MantenimientoDatos'
 *         - type: object
 *           required: [id_equipo, fecha_inicio, descripcion_falla, responsable]
 *     Mantenimiento:
 *       type: object
 *       description: Registro persistido; las consultas GET incluyen la propiedad Equipo
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         id_equipo:
 *           type: integer
 *         fecha_inicio:
 *           type: string
 *           format: date-time
 *         fecha_fin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         repuestos:
 *           type: string
 *           nullable: true
 *         descripcion_falla:
 *           type: string
 *         responsable:
 *           type: string
 *         estado:
 *           type: string
 *           enum: [pendiente, en_progreso, completado]
 *         observaciones:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         Equipo:
 *           $ref: '#/components/schemas/Equipo'
 *   parameters:
 *     MantenimientoId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *       description: ID del mantenimiento
 *   requestBodies:
 *     ActualizarMantenimiento:
 *       required: true
 *       description: PUT y PATCH permiten actualizaciones parciales. Solo se guardan los campos de mantenimiento; los identificadores y timestamps internos se ignoran.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MantenimientoDatos'
 *           example:
 *             estado: completado
 *             observaciones: Fuente reemplazada
 *   responses:
 *     MantenimientoOK:
 *       description: Mantenimiento obtenido o actualizado
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mantenimiento'
 *     MantenimientoError:
 *       description: Error de la operaciÃ³n; message describe la causa
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *               error:
 *                 type: string
 *           example:
 *             message: Mantenimiento no encontrado
 *             error: Mantenimiento no encontrado
 */

/**
 * @swagger
 * /api/mantenimientos:
 *   get:
 *     summary: Listar mantenimientos
 *     description: Incluye el equipo y ordena por fecha de inicio e ID descendentes.
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mantenimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mantenimiento'
 *       401:
 *         $ref: '#/components/responses/MantenimientoError'
 *       403:
 *         $ref: '#/components/responses/MantenimientoError'
 *       500:
 *         $ref: '#/components/responses/MantenimientoError'
 *   post:
 *     summary: Crear mantenimiento
 *     description: Los estados pendiente y en_progreso ponen al equipo en Mantenimiento. Devuelve 409 si estÃ¡ Solicitado o Prestado. La operaciÃ³n es transaccional.
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearMantenimiento'
 *     responses:
 *       201:
 *         description: Mantenimiento creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mantenimiento'
 *       400:
 *         $ref: '#/components/responses/MantenimientoError'
 *       401:
 *         $ref: '#/components/responses/MantenimientoError'
 *       403:
 *         $ref: '#/components/responses/MantenimientoError'
 *       404:
 *         $ref: '#/components/responses/MantenimientoError'
 *       409:
 *         $ref: '#/components/responses/MantenimientoError'
 *       500:
 *         $ref: '#/components/responses/MantenimientoError'
 * /api/mantenimientos/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/MantenimientoId'
 *   get:
 *     summary: Consultar un mantenimiento con su equipo
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MantenimientoOK'
 *       400:
 *         $ref: '#/components/responses/MantenimientoError'
 *       401:
 *         $ref: '#/components/responses/MantenimientoError'
 *       403:
 *         $ref: '#/components/responses/MantenimientoError'
 *       404:
 *         $ref: '#/components/responses/MantenimientoError'
 *       500:
 *         $ref: '#/components/responses/MantenimientoError'
 *   put:
 *     summary: Actualizar un mantenimiento
 *     description: ActualizaciÃ³n parcial. Al completar el Ãºltimo activo, libera el equipo si estaba en Mantenimiento. Reabrir limpia fecha_fin y falla con 409 si el equipo estÃ¡ Solicitado o Prestado.
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/ActualizarMantenimiento'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MantenimientoOK'
 *       400:
 *         $ref: '#/components/responses/MantenimientoError'
 *       401:
 *         $ref: '#/components/responses/MantenimientoError'
 *       403:
 *         $ref: '#/components/responses/MantenimientoError'
 *       404:
 *         $ref: '#/components/responses/MantenimientoError'
 *       409:
 *         $ref: '#/components/responses/MantenimientoError'
 *       500:
 *         $ref: '#/components/responses/MantenimientoError'
 *   patch:
 *     summary: Actualizar parcialmente un mantenimiento
 *     description: Mismas validaciones y sincronizaciÃ³n del equipo que PUT.
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/ActualizarMantenimiento'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/MantenimientoOK'
 *       400:
 *         $ref: '#/components/responses/MantenimientoError'
 *       401:
 *         $ref: '#/components/responses/MantenimientoError'
 *       403:
 *         $ref: '#/components/responses/MantenimientoError'
 *       404:
 *         $ref: '#/components/responses/MantenimientoError'
 *       409:
 *         $ref: '#/components/responses/MantenimientoError'
 *       500:
 *         $ref: '#/components/responses/MantenimientoError'
 *   delete:
 *     summary: Eliminar un mantenimiento
 *     description: Elimina el registro y libera el equipo si estaba en Mantenimiento y no quedan mantenimientos activos. OperaciÃ³n transaccional.
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mantenimiento eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mantenimiento eliminado exitosamente
 *       400:
 *         $ref: '#/components/responses/MantenimientoError'
 *       401:
 *         $ref: '#/components/responses/MantenimientoError'
 *       403:
 *         $ref: '#/components/responses/MantenimientoError'
 *       404:
 *         $ref: '#/components/responses/MantenimientoError'
 *       409:
 *         $ref: '#/components/responses/MantenimientoError'
 *       500:
 *         $ref: '#/components/responses/MantenimientoError'
 */
router.get('/', getMantenimientos);
router.get('/:id', getMantenimiento);
router.post('/', crearMantenimiento);
router.put('/:id', actualizarMantenimiento);
router.patch('/:id', actualizarMantenimiento);
router.delete('/:id', eliminarMantenimiento);

export default router;

