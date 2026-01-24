import { Router } from 'express';
import { getEquipos, createEquipo } from '../controllers/equipoController.js';

const router = Router();

router.get('/', getEquipos);
router.post('/', createEquipo);

export default router;