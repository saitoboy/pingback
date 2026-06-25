import { Router } from 'express';
import PeriodoLetivoController from '../controllers/periodoLetivo.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /periodo-letivo:
 *   get:
 *     tags: [Período Letivo]
 *     summary: Listar períodos letivos
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/PeriodoLetivo' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Período Letivo]
 *     summary: Criar período letivo (apenas ADMIN)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PeriodoLetivoInput' }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PeriodoLetivo' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', PeriodoLetivoController.listarPeriodosLetivos);

/**
 * @openapi
 * /periodo-letivo/atual:
 *   get:
 *     tags: [Período Letivo]
 *     summary: Buscar período letivo atual/ativo
 *     responses:
 *       200:
 *         description: Período atual
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PeriodoLetivo' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/atual', PeriodoLetivoController.buscarPeriodoLetivoAtual);

/**
 * @openapi
 * /periodo-letivo/ano/{ano_letivo_id}:
 *   get:
 *     tags: [Período Letivo]
 *     summary: Listar períodos de um ano letivo
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Períodos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/PeriodoLetivo' } }
 */
router.get('/ano/:ano_letivo_id', PeriodoLetivoController.buscarPeriodosLetivosPorAno);

/**
 * @openapi
 * /periodo-letivo/bimestre/{bimestre}/ano/{ano_letivo_id}:
 *   get:
 *     tags: [Período Letivo]
 *     summary: Buscar período por bimestre e ano
 *     parameters:
 *       - { in: path, name: bimestre, required: true, schema: { type: integer } }
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Período
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PeriodoLetivo' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/bimestre/:bimestre/ano/:ano_letivo_id', PeriodoLetivoController.buscarPeriodoLetivoPorBimestreEAno);

/**
 * @openapi
 * /periodo-letivo/{periodo_letivo_id}:
 *   get:
 *     tags: [Período Letivo]
 *     summary: Buscar período letivo por ID
 *     parameters:
 *       - { in: path, name: periodo_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Período
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PeriodoLetivo' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Período Letivo]
 *     summary: Atualizar período letivo (apenas ADMIN)
 *     parameters:
 *       - { in: path, name: periodo_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PeriodoLetivoInput' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PeriodoLetivo' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Período Letivo]
 *     summary: Deletar período letivo (apenas ADMIN)
 *     parameters:
 *       - { in: path, name: periodo_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:periodo_letivo_id', PeriodoLetivoController.buscarPeriodoLetivoPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN]), PeriodoLetivoController.criarPeriodoLetivo);

/**
 * @openapi
 * /periodo-letivo/criar-todos/{ano_letivo_id}:
 *   post:
 *     tags: [Período Letivo]
 *     summary: Criar todos os bimestres de um ano letivo (apenas ADMIN)
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       201:
 *         description: Bimestres criados
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/PeriodoLetivo' } }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.post('/criar-todos/:ano_letivo_id', autorizarPor([TipoUsuario.ADMIN]), PeriodoLetivoController.criarTodosBimestres);

/**
 * @openapi
 * /periodo-letivo/{periodo_letivo_id}/ativar:
 *   post:
 *     tags: [Período Letivo]
 *     summary: Ativar período letivo (apenas ADMIN)
 *     parameters:
 *       - { in: path, name: periodo_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Ativado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PeriodoLetivo' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.post('/:periodo_letivo_id/ativar', autorizarPor([TipoUsuario.ADMIN]), PeriodoLetivoController.ativarPeriodo);

router.put('/:periodo_letivo_id', autorizarPor([TipoUsuario.ADMIN]), PeriodoLetivoController.atualizarPeriodoLetivo);
router.delete('/:periodo_letivo_id', autorizarPor([TipoUsuario.ADMIN]), PeriodoLetivoController.deletarPeriodoLetivo);

export default router;
