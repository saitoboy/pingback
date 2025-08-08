import { Router } from 'express';
import MatriculaAlunoController from '../controllers/matriculaAluno.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', MatriculaAlunoController.listarMatriculas);
router.get('/:matricula_aluno_id', MatriculaAlunoController.buscarMatriculaPorId);
router.get('/aluno/:aluno_id', MatriculaAlunoController.buscarMatriculasPorAluno);
router.get('/turma/:turma_id', MatriculaAlunoController.buscarMatriculasPorTurma);
router.get('/ano-letivo/:ano_letivo_id', MatriculaAlunoController.buscarMatriculasPorAnoLetivo);
router.get('/status/:status', MatriculaAlunoController.buscarMatriculasPorStatus);
router.get('/ativa/:aluno_id/:ano_letivo_id', MatriculaAlunoController.buscarMatriculaAtivaAluno);

// Rotas que precisam de permissão de ADMIN ou SECRETARIO
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), MatriculaAlunoController.criarMatricula);
router.put('/:matricula_aluno_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), MatriculaAlunoController.atualizarMatricula);
router.delete('/:matricula_aluno_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), MatriculaAlunoController.deletarMatricula);

// Rotas especiais para operações específicas
router.put('/:matricula_aluno_id/transferir', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), MatriculaAlunoController.transferirAluno);
router.put('/:matricula_aluno_id/finalizar', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), MatriculaAlunoController.finalizarMatricula);

export default router;
