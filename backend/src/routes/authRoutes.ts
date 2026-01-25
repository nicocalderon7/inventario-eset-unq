import { Router } from 'express';
import { login } from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Login
 * tags: [Auth]
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: OK
 */
router.post('/login', login);

export default router;