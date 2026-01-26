import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import PasswordResetController from '../controllers/passwordReset.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

// Rota de login
router.post('/login', AuthController.login);
// Rota de registro
router.post('/registrar', AuthController.registrar);
// Rota para buscar dados do usuário logado (protegida)
router.get('/me', autenticar, AuthController.buscarUsuario);

// Rotas de redefinição de senha
router.post('/forgot-password', PasswordResetController.solicitarRedefinicao);
router.post('/verify-reset-code', PasswordResetController.verificarCodigo);
router.post('/reset-password', PasswordResetController.redefinirSenha);

export default router;
