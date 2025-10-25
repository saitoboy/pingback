import { Router } from 'express';
import UsuarioTipoController from '../controllers/usuarioTipo.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas de tipos de usuário requerem autenticação
router.use(autenticar);

// Listar todos os tipos de usuário
router.get('/', UsuarioTipoController.listarTiposUsuario);

// Buscar tipo de usuário por ID
router.get('/:id', UsuarioTipoController.buscarTipoUsuarioPorId);

// Criar tipo de usuário
router.post('/', UsuarioTipoController.criarTipoUsuario);

// Atualizar tipo de usuário
router.put('/:id', UsuarioTipoController.atualizarTipoUsuario);

// Excluir tipo de usuário
router.delete('/:id', UsuarioTipoController.excluirTipoUsuario);

export default router;