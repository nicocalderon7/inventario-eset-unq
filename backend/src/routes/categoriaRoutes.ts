import { Router } from 'express';
import { getCategorias, createCategoria } from '../controllers/categoriaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Listar todas las categorías
 *     description: Obtiene una lista completa de todas las categorías de equipos disponibles en el sistema
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener categorías"
 *                 error:
 *                   type: object
 *   post:
 *     summary: Crear una nueva categoría
 *     description: Registra una nueva categoría de equipos en el sistema (requiere autenticación)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la categoría
 *                 example: "Laptops"
 *               descripcion:
 *                 type: string
 *                 description: Descripción opcional de la categoría
 *                 example: "Equipos portátiles tipo laptop"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Error al crear la categoría - Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al crear categoría"
 *                 error:
 *                   type: object
 *       401:
 *         description: No autorizado - Token inválido o ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al crear categoría"
 *                 error:
 *                   type: object
 */
router.get('/', getCategorias);
router.post('/', verificarToken, createCategoria);

export default router;