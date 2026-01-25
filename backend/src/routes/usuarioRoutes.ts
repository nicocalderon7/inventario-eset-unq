import { Router } from 'express';
import { createUsuario, getUsuarios } from '../controllers/usuarioController.js';

const router = Router();

/**
 * @swagger
 * tags:
 * name: Usuarios
 * description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /api/usuarios:
 * post:
 * summary: Registrar un nuevo usuario
 * description: Crea un usuario en la base de datos para que pueda operar en el sistema.
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
 * format: email
 * example: "juan.perez@unq.edu.ar"
 * password:
 * type: string
 * format: password
 * example: "password123"
 * rol:
 * type: string
 * example: "admin"
 * responses:
 * 201:
 * description: Usuario creado exitosamente.
 * 400:
 * description: El email ya está registrado o datos inválidos.
 */
router.post('/', createUsuario);

/**
 * @swagger
 * /api/usuarios:
 * get:
 * summary: Obtener todos los usuarios
 * description: Retorna la lista de usuarios registrados. Requiere token.
 * tags: [Usuarios]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de usuarios.
 * 401:
 * description: No autorizado.
 */
router.get('/', getUsuarios);

export default router;