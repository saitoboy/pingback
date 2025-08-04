import { Router } from 'express';
import ProfessorController from '../controllers/professor.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rota para professor buscar seu próprio perfil
router.get('/me', ProfessorController.buscarMeuPerfil);

// Rotas que precisam de permissão de ADMIN
router.post('/', autorizarPor([TipoUsuario.ADMIN]), ProfessorController.criar);
router.get('/', autorizarPor([TipoUsuario.ADMIN]), ProfessorController.listar);
router.get('/:professor_id', autorizarPor([TipoUsuario.ADMIN]), ProfessorController.buscarPorId);
router.delete('/:professor_id', autorizarPor([TipoUsuario.ADMIN]), ProfessorController.deletar);

export default router;
