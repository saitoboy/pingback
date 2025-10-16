import { Router } from 'express';
import AulaController from '../controllers/aula.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas que precisam de permissão de ADMIN, SECRETARIO ou PROFESSOR
router.get('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.listarTodas);
router.get('/detalhes', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.buscarComDetalhes);
router.get('/vinculacao/:turma_disciplina_professor_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.buscarPorVinculacao);
router.get('/:aula_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.buscarPorId);
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.criar);
router.put('/:aula_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.atualizar);
router.delete('/:aula_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.deletar);

export default router;