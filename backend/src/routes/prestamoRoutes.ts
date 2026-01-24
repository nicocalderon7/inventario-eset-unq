import { Router } from 'express';
import { crearSolicitud, getPrestamos } from '../controllers/prestamoController.js';

const router = Router();

// Definimos los puntos de acceso (endpoints)
router.post('/', crearSolicitud);
router.get('/', getPrestamos);

export default router;