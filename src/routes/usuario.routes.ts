import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas de usuários requerem autenticação
router.use(autenticar);

/**
 * @openapi
 * /usuarios:
 *   get:
 *     tags: [Usuários]
 *     summary: Listar usuários
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Usuario' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 */
router.get('/', UsuarioController.listarUsuarios);

/**
 * @openapi
 * /usuarios/{id}:
 *   get:
 *     tags: [Usuários]
 *     summary: Buscar usuário por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Usuário
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Usuários]
 *     summary: Atualizar usuário
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_usuario: { type: string }
 *               email_usuario: { type: string, format: email }
 *               tipo_usuario_id: { type: string, enum: [admin, secretario, professor] }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Usuários]
 *     summary: Excluir usuário
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', UsuarioController.buscarUsuarioPorId);

router.put('/:id', UsuarioController.atualizarUsuario);
router.delete('/:id', UsuarioController.excluirUsuario);

export default router;
