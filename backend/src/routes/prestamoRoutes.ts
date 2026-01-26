import { Router } from 'express';
import { crearSolicitud, getPrestamos, actualizarPrestamo } from '../controllers/prestamoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/prestamos:
 *   post:
 *     summary: Crear un nuevo préstamo
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
 *                 example: 1
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Préstamo creado exitosamente
 *       401:
 *         description: No autorizado
 *   get:
 *     summary: Listar todos los préstamos
 *     tags: [Prestamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos obtenida exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/', verificarToken, crearSolicitud);
router.get('/', verificarToken, getPrestamos);

/**
 * @swagger
 * /api/prestamos/{id}:
 *   put:
 *     summary: Actualizar estado del préstamo (Devolución)
 *     tags: [Prestamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del préstamo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "devuelto"
 *     responses:
 *       200:
 *         description: Préstamo actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Préstamo no encontrado
 */
router.put('/:id', verificarToken, actualizarPrestamo);

export default router;