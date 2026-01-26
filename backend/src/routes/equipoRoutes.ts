import { Router } from 'express';
import { getEquipos, createEquipo } from '../controllers/equipoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/equipos:
 *   get:
 *     summary: Listar todos los equipos
 *     description: Obtiene una lista completa de todos los equipos registrados en el inventario
 *     tags: [Equipos]
 *     responses:
 *       200:
 *         description: Lista de equipos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipo'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Crear un nuevo equipo
 *     description: Registra un nuevo equipo en el inventario (requiere autenticación)
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - categoria
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre o modelo del equipo
 *                 example: "Laptop Dell Latitude 5420"
 *               categoria:
 *                 type: string
 *                 description: Categoría del equipo
 *                 example: "Laptop"
 *               estado:
 *                 type: string
 *                 description: Estado inicial del equipo
 *                 enum: [disponible, prestado, mantenimiento]
 *                 default: disponible
 *                 example: "disponible"
 *               numero_serie:
 *                 type: string
 *                 description: Número de serie único del equipo
 *                 example: "SN123456789"
 *               observaciones:
 *                 type: string
 *                 description: Observaciones o notas adicionales
 *                 example: "Equipo en perfecto estado, incluye cargador"
 *     responses:
 *       201:
 *         description: Equipo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Equipo creado exitosamente"
 *                 equipo:
 *                   $ref: '#/components/schemas/Equipo'
 *       400:
 *         description: Datos inválidos o incompletos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Nombre y categoría son requeridos"
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Token no proporcionado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getEquipos);
router.post('/', verificarToken, createEquipo);

export default router;