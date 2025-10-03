import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas de usuários requerem autenticação
router.use(autenticar);

// Listar todos os usuários
router.get('/', UsuarioController.listarUsuarios);

// Buscar usuário por ID
router.get('/:id', UsuarioController.buscarUsuarioPorId);

// Atualizar usuário
router.put('/:id', UsuarioController.atualizarUsuario);

// Excluir usuário
router.delete('/:id', UsuarioController.excluirUsuario);

export default router;
