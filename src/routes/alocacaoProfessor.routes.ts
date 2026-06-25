import { Router } from 'express';
import AlocacaoProfessorController from '../controllers/alocacaoProfessor.controller';

const router = Router();

// Rotas para buscar dados auxiliares

/**
 * @openapi
 * /alocacao-professor/professores:
 *   get:
 *     tags: [Alocação Professor]
 *     summary: Listar professores disponíveis para alocação
 *     security: []
 *     responses:
 *       200:
 *         description: Professores
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Professor' } }
 */
router.get('/professores', AlocacaoProfessorController.buscarProfessores);

/**
 * @openapi
 * /alocacao-professor/disciplinas:
 *   get:
 *     tags: [Alocação Professor]
 *     summary: Listar disciplinas disponíveis para alocação
 *     security: []
 *     responses:
 *       200:
 *         description: Disciplinas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Disciplina' } }
 */
router.get('/disciplinas', AlocacaoProfessorController.buscarDisciplinas);

/**
 * @openapi
 * /alocacao-professor/turmas/{ano_letivo_id}:
 *   get:
 *     tags: [Alocação Professor]
 *     summary: Listar turmas de um ano letivo para alocação
 *     security: []
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Turmas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Turma' } }
 */
router.get('/turmas/:ano_letivo_id', AlocacaoProfessorController.buscarTurmas);

/**
 * @openapi
 * /alocacao-professor/ano-letivo/{ano_letivo_id}:
 *   get:
 *     tags: [Alocação Professor]
 *     summary: Listar alocações por ano letivo
 *     security: []
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Alocações
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/TurmaDisciplinaProfessor' } }
 */
router.get('/ano-letivo/:ano_letivo_id', AlocacaoProfessorController.listarPorAnoLetivo);

/**
 * @openapi
 * /alocacao-professor/professor/{professor_id}:
 *   get:
 *     tags: [Alocação Professor]
 *     summary: Listar alocações de um professor
 *     security: []
 *     parameters:
 *       - { in: path, name: professor_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Alocações
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/TurmaDisciplinaProfessor' } }
 */
router.get('/professor/:professor_id', AlocacaoProfessorController.listarPorProfessor);

/**
 * @openapi
 * /alocacao-professor/estatisticas/{ano_letivo_id}:
 *   get:
 *     tags: [Alocação Professor]
 *     summary: Estatísticas de alocação por ano letivo
 *     security: []
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/estatisticas/:ano_letivo_id', AlocacaoProfessorController.obterEstatisticas);

/**
 * @openapi
 * /alocacao-professor:
 *   post:
 *     tags: [Alocação Professor]
 *     summary: Criar alocação (vinculação turma-disciplina-professor)
 *     security: []
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
 *       400: { $ref: '#/components/responses/ErroValidacao' }
 */
router.post('/', AlocacaoProfessorController.criar);

/**
 * @openapi
 * /alocacao-professor/{id}:
 *   delete:
 *     tags: [Alocação Professor]
 *     summary: Remover alocação por ID
 *     security: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.delete('/:id', AlocacaoProfessorController.remover);

/**
 * @openapi
 * /alocacao-professor/professor/{professor_id}/ano-letivo/{ano_letivo_id}:
 *   delete:
 *     tags: [Alocação Professor]
 *     summary: Remover todas as alocações de um professor em um ano letivo
 *     security: []
 *     parameters:
 *       - { in: path, name: professor_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removidas }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.delete('/professor/:professor_id/ano-letivo/:ano_letivo_id', AlocacaoProfessorController.removerPorProfessorAno);

export default router;
