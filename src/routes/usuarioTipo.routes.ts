import { Router } from 'express';
import UsuarioTipoController from '../controllers/usuarioTipo.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas de tipos de usuário requerem autenticação
router.use(autenticar);

/**
 * @openapi
 * /usuario-tipo:
 *   get:
 *     tags: [Tipos de Usuário]
 *     summary: Listar tipos de usuário
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/UsuarioTipo' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Tipos de Usuário]
 *     summary: Criar tipo de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome_tipo]
 *             properties:
 *               nome_tipo: { type: string, enum: [admin, secretario, professor] }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UsuarioTipo' }
 */
router.get('/', UsuarioTipoController.listarTiposUsuario);

/**
 * @openapi
 * /usuario-tipo/{id}:
 *   get:
 *     tags: [Tipos de Usuário]
 *     summary: Buscar tipo de usuário por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Tipo de usuário
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UsuarioTipo' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Tipos de Usuário]
 *     summary: Atualizar tipo de usuário
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_tipo: { type: string, enum: [admin, secretario, professor] }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UsuarioTipo' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Tipos de Usuário]
 *     summary: Excluir tipo de usuário
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', UsuarioTipoController.buscarTipoUsuarioPorId);

router.post('/', UsuarioTipoController.criarTipoUsuario);
router.put('/:id', UsuarioTipoController.atualizarTipoUsuario);
router.delete('/:id', UsuarioTipoController.excluirTipoUsuario);

export default router;
