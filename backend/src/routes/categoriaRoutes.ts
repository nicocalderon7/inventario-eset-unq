import { Router } from 'express';
import { login } from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Envía las credenciales para obtener un token JWT que permita usar las rutas protegidas.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@unq.edu.ar
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Autenticación exitosa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para enviar en el header 'Authorization'
 *       401:
 *         description: Credenciales incorrectas.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/login', login);

export default router;