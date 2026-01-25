import { Router } from 'express';
import { createUsuario, getUsuarios } from '../controllers/usuarioController.js';

const router = Router();

/**
 * @swagger
 * /api/usuarios:
 * post:
 * summary: Registrar un nuevo usuario
 * tags: [Usuarios]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - nombre
 * - email
 * - password
 * properties:
 * nombre:
 * type: string
 * example: "Juan Perez"
 * email:
 * type: string
 * example: "juan.perez@unq.edu.ar"
 * password:
 * type: string
 * example: "password123"
 * rol:
 * type: string
 * example: "admin"
 * responses:
 * 201:
 * description: Usuario creado exitosamente.
 * get:
 * summary: Obtener todos los usuarios
 * tags: [Usuarios]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de usuarios.
 */
router.post('/', createUsuario);
router.get('/', getUsuarios);

export default router;