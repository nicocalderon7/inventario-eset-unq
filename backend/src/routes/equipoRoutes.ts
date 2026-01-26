import { Router } from 'express';
import { getEquipos, createEquipo } from '../controllers/equipoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/equipos:
 *   get:
 *     summary: Listar equipos
 *     tags: [Equipos]
 *     responses:
 *       200:
 *         description: Lista de equipos obtenida exitosamente
 *   post:
 *     summary: Crear equipo
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Equipo creado exitosamente
 */
router.get('/', getEquipos);
router.post('/', verificarToken, createEquipo);

export default router;