import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import PasswordResetController from '../controllers/passwordReset.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Autenticar usuário e obter token JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginInput' }
 *     responses:
 *       200:
 *         description: Login realizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/LoginResposta' }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 */
router.post('/login', AuthController.login);

/**
 * @openapi
 * /auth/registrar:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar novo usuário
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegistrarInput' }
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       400: { $ref: '#/components/responses/ErroValidacao' }
 */
router.post('/registrar', AuthController.registrar);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Dados do usuário autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 */
router.get('/me', autenticar, AuthController.buscarUsuario);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Solicitar código de redefinição de senha
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ForgotPasswordInput' }
 *     responses:
 *       200:
 *         description: Código enviado por e-mail
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.post('/forgot-password', PasswordResetController.solicitarRedefinicao);

/**
 * @openapi
 * /auth/verify-reset-code:
 *   post:
 *     tags: [Auth]
 *     summary: Verificar código de redefinição
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/VerifyResetCodeInput' }
 *     responses:
 *       200:
 *         description: Código válido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       400: { $ref: '#/components/responses/ErroValidacao' }
 */
router.post('/verify-reset-code', PasswordResetController.verificarCodigo);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Redefinir senha com código verificado
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ResetPasswordInput' }
 *     responses:
 *       200:
 *         description: Senha redefinida
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       400: { $ref: '#/components/responses/ErroValidacao' }
 */
router.post('/reset-password', PasswordResetController.redefinirSenha);

export default router;
