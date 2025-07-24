import { Router } from 'express';
import UsuarioTipoController from '../controller/usuarioTipo.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Listar todos os tipos de usuário
router.get('/', autenticar, autorizarPor([TipoUsuario.ADMIN]), UsuarioTipoController.listar);

// Criar novo tipo de usuário
router.post('/', autenticar, autorizarPor([TipoUsuario.ADMIN]), UsuarioTipoController.criar);

export default router;
