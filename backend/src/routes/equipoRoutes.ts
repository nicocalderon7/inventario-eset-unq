import { Router } from 'express';
import { getEquipos, createEquipo } from '../controllers/equipoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js'; // Asegúrate de importar tu middleware si el post lo requiere

const router = Router();

/**
  * @swagger
  * /api/equipos:
  * get:
  * summary: Obtener todos los equipos
  * tags: [Equipos]
  * responses:
  * 200:
  * description: Lista de equipos obtenida correctamente.
  * post:
  * summary: Registrar un nuevo equipo
  * tags: [Equipos]
  * security:
  * - bearerAuth: []
  * requestBody:
  * required: true
  * content:
  * application/json:
  * schema:
  * type: object
  * required: [nombre, marca, id_categoria]
  * properties:
  * nombre:
  * type: string
  * example: "Dell Latitude 3420"
  * marca:
  * type: string
  * example: "Dell"
  * id_categoria:
  * type: integer
  * example: 1
  * nro_serie:
  * type: string
  * example: "ABC123XYZ"
  * responses:
  * 201:
  * description: Equipo creado exitosamente.
  * 401:
  * description: No autorizado.
  */
router.get('/', getEquipos);
router.post('/', verificarToken, createEquipo);

export default router;