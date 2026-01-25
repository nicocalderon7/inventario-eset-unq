import { Router } from 'express';
import { crearSolicitud, getPrestamos, actualizarPrestamo } from '../controllers/prestamoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 * name: Prestamos
 * description: Gestión de préstamos y devoluciones de equipos
 */

/**
 * @swagger
 * /api/prestamos:
 * post:
 * summary: Crear un nuevo préstamo
 * description: Registra un préstamo y cambia el estado del equipo a "prestado". Requiere token.
 * tags: [Prestamos]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - id_equipo
 * - id_usuario
 * properties:
 * id_equipo:
 * type: integer
 * example: 1
 * id_usuario:
 * type: integer
 * example: 2
 * fecha_devolucion_prevista:
 * type: string
 * format: date
 * example: "2026-02-01"
 * responses:
 * 201:
 * description: Préstamo creado exitosamente.
 * 400:
 * description: El equipo no está disponible o datos inválidos.
 * 401:
 * description: Token no provisto o inválido.
 */
router.post('/', verificarToken, crearSolicitud);

/**
 * @swagger
 * /api/prestamos:
 * get:
 * summary: Listar todos los préstamos
 * description: Obtiene el historial completo de préstamos. Requiere token.
 * tags: [Prestamos]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de préstamos obtenida.
 * 401:
 * description: No autorizado.
 */
router.get('/', verificarToken, getPrestamos);

/**
 * @swagger
 * /api/prestamos/{id}:
 * put:
 * summary: Actualizar estado de un préstamo (Devolución)
 * description: Cambia el estado del préstamo (ej. a "devuelto") y libera el equipo asociado poniéndolo en "funcional".
 * tags: [Prestamos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID del préstamo a actualizar
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * estado:
 * type: string
 * example: "devuelto"
 * responses:
 * 200:
 * description: Préstamo actualizado y equipo liberado.
 * 404:
 * description: Préstamo no encontrado.
 */
router.put('/:id', verificarToken, actualizarPrestamo);

export default router;