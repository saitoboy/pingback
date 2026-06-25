import { Router } from 'express';
import TurmaDisciplinaProfessorController from '../controllers/turmaDisciplinaProfessor.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

router.use(autenticar);

/**
 * @openapi
 * /vinculacao:
 *   get:
 *     tags: [Vinculação]
 *     summary: Listar vinculações turma-disciplina-professor
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/TurmaDisciplinaProfessor' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Vinculação]
 *     summary: Criar vinculação (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/VinculacaoInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TurmaDisciplinaProfessor' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', TurmaDisciplinaProfessorController.listarVinculacoes);

/**
 * @openapi
 * /vinculacao/{id}:
 *   get:
 *     tags: [Vinculação]
 *     summary: Buscar vinculação por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Vinculação
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TurmaDisciplinaProfessor' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Vinculação]
 *     summary: Deletar vinculação (apenas ADMIN)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', TurmaDisciplinaProfessorController.buscarVinculacaoPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), TurmaDisciplinaProfessorController.criarVinculacao);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN]), TurmaDisciplinaProfessorController.deletarVinculacao);

export default router;
