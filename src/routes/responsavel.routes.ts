import { Router } from 'express';
import { ResponsavelController } from '../controllers/responsavel.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', ResponsavelController.listarResponsaveis);
router.get('/:id', ResponsavelController.buscarResponsavelPorId);
router.get('/aluno/:aluno_id', ResponsavelController.listarResponsaveisPorAluno);
router.get('/cpf/:cpf', ResponsavelController.buscarResponsavelPorCpf);

// Rotas que precisam de permissão de ADMIN
router.post('/', autorizarPor([TipoUsuario.ADMIN]), ResponsavelController.criarResponsavel);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN]), ResponsavelController.atualizarResponsavel);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN]), ResponsavelController.deletarResponsavel);

export default router;
