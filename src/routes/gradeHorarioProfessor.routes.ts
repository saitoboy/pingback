import { Router } from 'express';
import GradeHorarioProfessorController from '../controllers/gradeHorarioProfessor.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(autenticar);

/**
 * @openapi
 * /grade-horario:
 *   get:
 *     tags: [Grade Horário]
 *     summary: Listar grades de horário
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/GradeHorarioProfessor' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Grade Horário]
 *     summary: Criar grade de horário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GradeHorarioInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GradeHorarioProfessor' }
 */
router.get('/', GradeHorarioProfessorController.listar);

/**
 * @openapi
 * /grade-horario/vinculacao/{vinculacaoId}:
 *   get:
 *     tags: [Grade Horário]
 *     summary: Buscar grades por vinculação
 *     parameters:
 *       - { in: path, name: vinculacaoId, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Grades
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/GradeHorarioProfessor' } }
 *   delete:
 *     tags: [Grade Horário]
 *     summary: Deletar todas as grades de uma vinculação
 *     parameters:
 *       - { in: path, name: vinculacaoId, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removidas }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/vinculacao/:vinculacaoId', GradeHorarioProfessorController.buscarPorVinculacao);

/**
 * @openapi
 * /grade-horario/professor/{professorId}:
 *   get:
 *     tags: [Grade Horário]
 *     summary: Buscar grades por professor
 *     parameters:
 *       - { in: path, name: professorId, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Grades
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/GradeHorarioProfessor' } }
 */
router.get('/professor/:professorId', GradeHorarioProfessorController.buscarPorProfessor);

/**
 * @openapi
 * /grade-horario/lote:
 *   post:
 *     tags: [Grade Horário]
 *     summary: Criar múltiplas grades em lote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items: { $ref: '#/components/schemas/GradeHorarioInput' }
 *     responses:
 *       201:
 *         description: Grades criadas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.post('/lote', GradeHorarioProfessorController.criarEmLote);

/**
 * @openapi
 * /grade-horario/{id}:
 *   get:
 *     tags: [Grade Horário]
 *     summary: Buscar grade por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Grade
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GradeHorarioProfessor' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Grade Horário]
 *     summary: Atualizar grade
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GradeHorarioInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GradeHorarioProfessor' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Grade Horário]
 *     summary: Deletar grade
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', GradeHorarioProfessorController.buscarPorId);

router.post('/', GradeHorarioProfessorController.criar);
router.put('/:id', GradeHorarioProfessorController.atualizar);
router.delete('/:id', GradeHorarioProfessorController.deletar);
router.delete('/vinculacao/:vinculacaoId', GradeHorarioProfessorController.deletarPorVinculacao);

export default router;
