import { Router } from 'express';
import AlocacaoProfessorController from '../controllers/alocacaoProfessor.controller';

const router = Router();

// Rotas para buscar dados auxiliares
router.get('/professores', AlocacaoProfessorController.buscarProfessores);
router.get('/disciplinas', AlocacaoProfessorController.buscarDisciplinas);
router.get('/turmas/:ano_letivo_id', AlocacaoProfessorController.buscarTurmas);

// Rotas para gerenciar alocações
router.get('/ano-letivo/:ano_letivo_id', AlocacaoProfessorController.listarPorAnoLetivo);
router.get('/professor/:professor_id', AlocacaoProfessorController.listarPorProfessor);
router.get('/estatisticas/:ano_letivo_id', AlocacaoProfessorController.obterEstatisticas);

router.post('/', AlocacaoProfessorController.criar);

router.delete('/:id', AlocacaoProfessorController.remover);
router.delete('/professor/:professor_id/ano-letivo/:ano_letivo_id', AlocacaoProfessorController.removerPorProfessorAno);

export default router;

