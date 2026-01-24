import { Router } from 'express';
import { createUsuario, getUsuarios } from '../controllers/usuarioController.js';

const router = Router();

router.post('/', createUsuario);
router.get('/', getUsuarios);

export default router;