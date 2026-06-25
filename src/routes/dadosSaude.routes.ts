import { Router } from 'express';
import { DadosSaudeController } from '../controllers/dadosSaude.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /dados-saude:
 *   get:
 *     tags: [Dados de Saúde]
 *     summary: Listar dados de saúde
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/DadosSaude' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Dados de Saúde]
 *     summary: Criar dados de saúde (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DadosSaude' }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DadosSaude' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', DadosSaudeController.listarDadosSaude);

/**
 * @openapi
 * /dados-saude/aluno/{aluno_id}:
 *   get:
 *     tags: [Dados de Saúde]
 *     summary: Buscar dados de saúde por aluno
 *     parameters:
 *       - { in: path, name: aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Dados de saúde
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DadosSaude' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/aluno/:aluno_id', DadosSaudeController.buscarDadosSaudePorAlunoId);

/**
 * @openapi
 * /dados-saude/{id}:
 *   get:
 *     tags: [Dados de Saúde]
 *     summary: Buscar dados de saúde por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Dados de saúde
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DadosSaude' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Dados de Saúde]
 *     summary: Atualizar dados de saúde (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DadosSaude' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/DadosSaude' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Dados de Saúde]
 *     summary: Deletar dados de saúde (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', DadosSaudeController.buscarDadosSaudePorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DadosSaudeController.criarDadosSaude);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DadosSaudeController.atualizarDadosSaude);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DadosSaudeController.deletarDadosSaude);

export default router;
