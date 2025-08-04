import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

// Rota de login
router.post('/login', AuthController.login);
// Rota de registro
router.post('/registrar', AuthController.registrar);
// Rota para buscar dados do usuário logado (protegida)
router.get('/me', autenticar, AuthController.buscarUsuario);

export default router;
