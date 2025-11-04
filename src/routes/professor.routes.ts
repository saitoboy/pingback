import { Router } from 'express';
import ProfessorController from '../controllers/professor.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rota para professor buscar seu próprio perfil
router.get('/me', ProfessorController.buscarMeuPerfil);

// Rota para professor buscar suas próprias turmas
router.get('/minhas-turmas', ProfessorController.listarMinhasTurmas);

// Rotas que precisam de permissão de ADMIN ou SECRETARIO
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.criar);
router.get('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.listar);
router.get('/com-turmas', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.listarComTurmas);
router.get('/:professorId/turmas', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.listarTurmasProfessor);
router.get('/:professor_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.buscarPorId);
router.delete('/:professor_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.deletar);

export default router;
