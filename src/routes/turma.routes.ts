import { Router } from 'express';
import TurmaController from '../controllers/turma.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /turma:
 *   get:
 *     tags: [Turma]
 *     summary: Listar turmas
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Turma' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Turma]
 *     summary: Criar turma (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TurmaInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Turma' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', TurmaController.listarTurmas);

/**
 * @openapi
 * /turma/serie/{serie_id}:
 *   get:
 *     tags: [Turma]
 *     summary: Buscar turmas por série
 *     parameters:
 *       - { in: path, name: serie_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Turmas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Turma' } }
 */
router.get('/serie/:serie_id', TurmaController.buscarTurmasPorSerie);

/**
 * @openapi
 * /turma/ano-letivo/{ano_letivo_id}:
 *   get:
 *     tags: [Turma]
 *     summary: Buscar turmas por ano letivo
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Turmas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Turma' } }
 */
router.get('/ano-letivo/:ano_letivo_id', TurmaController.buscarTurmasPorAnoLetivo);

/**
 * @openapi
 * /turma/serie/{serie_id}/ano/{ano_letivo_id}:
 *   get:
 *     tags: [Turma]
 *     summary: Buscar turmas por série e ano letivo
 *     parameters:
 *       - { in: path, name: serie_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Turmas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Turma' } }
 */
router.get('/serie/:serie_id/ano/:ano_letivo_id', TurmaController.buscarTurmasPorSerieEAno);

/**
 * @openapi
 * /turma/turno/{turno}:
 *   get:
 *     tags: [Turma]
 *     summary: Buscar turmas por turno
 *     parameters:
 *       - { in: path, name: turno, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Turmas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Turma' } }
 */
router.get('/turno/:turno', TurmaController.buscarTurmasPorTurno);

/**
 * @openapi
 * /turma/{turma_id}:
 *   get:
 *     tags: [Turma]
 *     summary: Buscar turma por ID
 *     parameters:
 *       - { in: path, name: turma_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Turma
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Turma' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Turma]
 *     summary: Atualizar turma (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: turma_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TurmaInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Turma' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Turma]
 *     summary: Deletar turma (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: turma_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:turma_id', TurmaController.buscarTurmaPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), TurmaController.criarTurma);
router.put('/:turma_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), TurmaController.atualizarTurma);
router.delete('/:turma_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), TurmaController.deletarTurma);

export default router;
