import { Router } from 'express';
import { getEquipos, createEquipo } from '../controllers/equipoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 * name: Equipos
 * description: Gestión del inventario de hardware
 */

/**
 * @swagger
 * /api/equipos:
 * get:
 * summary: Obtener todos los equipos
 * description: Retorna una lista de todos los equipos registrados, incluyendo su categoría y estado operativo.
 * tags: [Equipos]
 * responses:
 * 200:
 * description: Lista de equipos obtenida correctamente.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * 500:
 * description: Error del servidor.
 */
router.get('/', getEquipos);

/**
 * @swagger
 * /api/equipos:
 * post:
 * summary: Registrar un nuevo equipo
 * description: Agrega un nuevo equipo al inventario. Requiere token de administrador.
 * tags: [Equipos]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - nombre
 * - marca
 * - id_categoria
 * properties:
 * nombre:
 * type: string
 * example: "Dell Latitude 3420"
 * marca:
 * type: string
 * example: "Dell"
 * modelo:
 * type: string
 * example: "Latitude 3420"
 * nro_serie:
 * type: string
 * example: "ABC123XYZ"
 * id_categoria:
 * type: integer
 * example: 1
 * nro_patrimonio:
 * type: string
 * example: "UNQ-001"
 * propietario:
 * type: string
 * example: "Departamento de Ciencia y Tecnología"
 * responses:
 * 201:
 * description: Equipo creado exitosamente.
 * 401:
 * description: No autorizado (Token faltante o inválido).
 * 400:
 * description: Datos de entrada inválidos.
 */
router.post('/', createEquipo);

export default router;