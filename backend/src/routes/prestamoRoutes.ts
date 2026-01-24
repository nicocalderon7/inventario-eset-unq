import { Router } from 'express';
import { crearSolicitud, getPrestamos, actualizarPrestamo } from '../controllers/prestamoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', verificarToken, crearSolicitud);
router.get('/', verificarToken, getPrestamos);
router.put('/:id', verificarToken, actualizarPrestamo);

export default router;