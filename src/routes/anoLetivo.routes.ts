import { Router } from 'express';
import AnoLetivoController from '../controllers/anoLetivo.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', AnoLetivoController.listarAnosLetivos);
router.get('/:ano_letivo_id', AnoLetivoController.buscarAnoLetivoPorId);
router.get('/ano/:ano', AnoLetivoController.buscarAnoLetivoPorAno);

// Rotas que precisam de permissão de ADMIN ou SECRETARIO
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AnoLetivoController.criarAnoLetivo);
router.put('/:ano_letivo_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AnoLetivoController.atualizarAnoLetivo);
router.delete('/:ano_letivo_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AnoLetivoController.deletarAnoLetivo);

export default router;
