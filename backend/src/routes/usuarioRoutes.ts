import { Router } from 'express';
import { createUsuario, getUsuarios } from '../controllers/usuarioController.js';

const router = Router();

/**
 * @swagger
 * /api/usuarios:
 * post:
 * summary: Crear usuario
 * tags: [Usuarios]
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nombre:
 * type: string
 * email:
 * type: string
 * responses:
 * 201:
 * description: Creado
 * get:
 * summary: Listar usuarios
 * tags: [Usuarios]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: OK
 */
router.post('/', createUsuario);
router.get('/', getUsuarios);

export default router;