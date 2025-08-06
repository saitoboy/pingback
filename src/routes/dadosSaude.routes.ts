import { Router } from 'express';
import { DadosSaudeController } from '../controllers/dadosSaude.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', DadosSaudeController.listarDadosSaude);
router.get('/:id', DadosSaudeController.buscarDadosSaudePorId);
router.get('/aluno/:aluno_id', DadosSaudeController.buscarDadosSaudePorAlunoId);

// Rotas que precisam de permissão de ADMIN ou SECRETARIO
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DadosSaudeController.criarDadosSaude);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DadosSaudeController.atualizarDadosSaude);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DadosSaudeController.deletarDadosSaude);

export default router;
