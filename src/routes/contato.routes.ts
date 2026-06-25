import { Router } from 'express';
import ContatoController from '../controllers/contato.controller';

const router = Router();

/**
 * @openapi
 * /contato:
 *   post:
 *     tags: [Contato]
 *     summary: Enviar mensagem de contato (público, sem autenticação)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ContatoInput' }
 *     responses:
 *       200:
 *         description: Mensagem enviada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       400: { $ref: '#/components/responses/ErroValidacao' }
 */
router.post('/', ContatoController.enviarMensagem);

export default router;
