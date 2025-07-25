import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

// Rota de login
router.post('/login', AuthController.login);
// Rota de registro
router.post('/registrar', AuthController.registrar);

export default router;
