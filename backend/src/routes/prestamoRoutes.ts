import { Router } from 'express';
import { crearSolicitud, getPrestamos, actualizarPrestamo } from '../controllers/prestamoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/prestamos:
 *   post:
 *     summary: Crear una solicitud de préstamo
 *     description: Registra una nueva solicitud de préstamo de equipo (requiere autenticación)
 *     tags: [Prestamos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_equipo
 *               - id_usuario
 *             properties:
 *               id_equipo:
 *                 type: integer
 *                 description: ID del equipo a solicitar
 *                 example: 5
 *               id_usuario:
 *                 type: integer
 *                 description: ID del usuario que solicita el préstamo
 *                 example: 3
 *               observaciones:
 *                 type: string
 *                 description: Motivo o detalles del préstamo
 *                 example: "Necesito la laptop para proyecto de investigación"
 *     responses:
 *       201:
 *         description: Solicitud de préstamo creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Solicitud de préstamo creada exitosamente"
 *                 prestamo:
 *                   $ref: '#/components/schemas/Prestamo'
 *       400:
 *         description: Datos inválidos o equipo no disponible
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               equipoNoDIsponible:
 *                 value:
 *                   error: "El equipo no está disponible"
 *               datosIncompletos:
 *                 value:
 *                   error: "id_equipo e id_usuario son requeridos"
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Equipo o usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Equipo no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Listar todos los préstamos
 *     description: Obtiene una lista completa de todos los préstamos registrados (requiere autenticación)
 *     tags: [Prestamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prestamo'
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', verificarToken, crearSolicitud);
router.get('/', verificarToken, getPrestamos);

/**
 * @swagger
 * /api/prestamos/{id}:
 *   put:
 *     summary: Actualizar estado de un préstamo
 *     description: Actualiza el estado de un préstamo existente (aprobar, rechazar, devolver) - Requiere autenticación
 *     tags: [Prestamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del préstamo a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 description: Nuevo estado del préstamo
 *                 enum: [pendiente, aprobado, rechazado, devuelto]
 *                 example: "aprobado"
 *               observaciones:
 *                 type: string
 *                 description: Observaciones sobre el cambio de estado
 *                 example: "Aprobado por el administrador"
 *     responses:
 *       200:
 *         description: Préstamo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Préstamo actualizado exitosamente"
 *                 prestamo:
 *                   $ref: '#/components/schemas/Prestamo'
 *       400:
 *         description: Estado inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Estado inválido"
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Préstamo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Préstamo no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', verificarToken, actualizarPrestamo);

export default router;