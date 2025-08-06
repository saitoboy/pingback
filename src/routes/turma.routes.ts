import { Router } from 'express';
import TurmaController from '../controllers/turma.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', TurmaController.listarTurmas);
router.get('/:turma_id', TurmaController.buscarTurmaPorId);
router.get('/serie/:serie_id', TurmaController.buscarTurmasPorSerie);
router.get('/ano-letivo/:ano_letivo_id', TurmaController.buscarTurmasPorAnoLetivo);
router.get('/serie/:serie_id/ano/:ano_letivo_id', TurmaController.buscarTurmasPorSerieEAno);
router.get('/turno/:turno', TurmaController.buscarTurmasPorTurno);

// Rotas que precisam de permissão de ADMIN ou SECRETARIO
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), TurmaController.criarTurma);
router.put('/:turma_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), TurmaController.atualizarTurma);
router.delete('/:turma_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), TurmaController.deletarTurma);

export default router;
