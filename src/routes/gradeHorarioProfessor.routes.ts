import { Router } from 'express';
import GradeHorarioProfessorController from '../controllers/gradeHorarioProfessor.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(autenticar);

// Listar todas as grades
router.get('/', GradeHorarioProfessorController.listar);

// Buscar grade por ID
router.get('/:id', GradeHorarioProfessorController.buscarPorId);

// Buscar grades por vinculação (turma-disciplina-professor)
router.get('/vinculacao/:vinculacaoId', GradeHorarioProfessorController.buscarPorVinculacao);

// Buscar grades por professor
router.get('/professor/:professorId', GradeHorarioProfessorController.buscarPorProfessor);

// Criar nova grade
router.post('/', GradeHorarioProfessorController.criar);

// Criar múltiplas grades em lote
router.post('/lote', GradeHorarioProfessorController.criarEmLote);

// Atualizar grade
router.put('/:id', GradeHorarioProfessorController.atualizar);

// Deletar grade
router.delete('/:id', GradeHorarioProfessorController.deletar);

// Deletar todas as grades de uma vinculação
router.delete('/vinculacao/:vinculacaoId', GradeHorarioProfessorController.deletarPorVinculacao);

export default router;

