import { Router } from 'express';
import PeriodoLetivoController from '../controllers/periodoLetivo.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', PeriodoLetivoController.listarPeriodosLetivos);
router.get('/atual', PeriodoLetivoController.buscarPeriodoLetivoAtual);
router.get('/:periodo_letivo_id', PeriodoLetivoController.buscarPeriodoLetivoPorId);
router.get('/ano/:ano_letivo_id', PeriodoLetivoController.buscarPeriodosLetivosPorAno);
router.get('/bimestre/:bimestre/ano/:ano_letivo_id', PeriodoLetivoController.buscarPeriodoLetivoPorBimestreEAno);

// Rotas exclusivas do ADMIN
router.post('/', autorizarPor([TipoUsuario.ADMIN]), PeriodoLetivoController.criarPeriodoLetivo);
router.post('/criar-todos/:ano_letivo_id', autorizarPor([TipoUsuario.ADMIN]), PeriodoLetivoController.criarTodosBimestres);
router.post('/:periodo_letivo_id/ativar', autorizarPor([TipoUsuario.ADMIN]), PeriodoLetivoController.ativarPeriodo);
router.put('/:periodo_letivo_id', autorizarPor([TipoUsuario.ADMIN]), PeriodoLetivoController.atualizarPeriodoLetivo);
router.delete('/:periodo_letivo_id', autorizarPor([TipoUsuario.ADMIN]), PeriodoLetivoController.deletarPeriodoLetivo);

export default router;
