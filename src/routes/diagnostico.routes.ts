import { Router } from 'express';
import DiagnosticoController from '../controllers/diagnostico.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', DiagnosticoController.listarDiagnosticos);
router.get('/:diagnostico_id', DiagnosticoController.buscarDiagnosticoPorId);
router.get('/aluno/:aluno_id', DiagnosticoController.buscarDiagnosticoPorAluno);

// Rotas que precisam de permissão de ADMIN ou SECRETARIO
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DiagnosticoController.criarDiagnostico);
router.put('/:diagnostico_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DiagnosticoController.atualizarDiagnostico);
router.delete('/:diagnostico_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DiagnosticoController.deletarDiagnostico);

export default router;
