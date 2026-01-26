import { Router } from 'express';
import { crearSolicitud, getPrestamos, actualizarPrestamo } from '../controllers/prestamoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
  * @swagger
  * /api/prestamos:
  * post:
  * summary: Crear un nuevo préstamo
  * tags: [Prestamos]
  * security:
  * - bearerAuth: []
  * requestBody:
  * required: true
  * content:
  * application/json:
  * schema:
  * type: object
  * properties:
  * id_equipo:
  * type: integer
  * id_usuario:
  * type: integer
  * responses:
  * 201:
  * description: Creado
  * get:
  * summary: Listar todos los préstamos
  * tags: [Prestamos]
  * security:
  * - bearerAuth: []
  * responses:
  * 200:
  * description: OK
  */
router.post('/', verificarToken, crearSolicitud);
router.get('/', verificarToken, getPrestamos);

/**
  * @swagger
  * /api/prestamos/{id}:
  * put:
  * summary: Actualizar estado (Devolución)
  * tags: [Prestamos]
  * security:
  * - bearerAuth: []
  * parameters:
  * - in: path
  * name: id
  * required: true
  * schema:
  * type: integer
  * requestBody:
  * content:
  * application/json:
  * schema:
  * type: object
  * properties:
  * estado:
  * type: string
  * responses:
  * 200:
  * description: Actualizado
  */
router.put('/:id', verificarToken, actualizarPrestamo);

export default router;