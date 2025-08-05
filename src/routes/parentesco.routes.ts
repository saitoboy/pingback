import { Router } from 'express';
import { ParentescoController } from '../controllers/parentesco.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', ParentescoController.listarParentescos);
router.get('/:id', ParentescoController.buscarParentescoPorId);

// Rotas que precisam de permissão de ADMIN
router.post('/', autorizarPor([TipoUsuario.ADMIN]), ParentescoController.criarParentesco);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN]), ParentescoController.atualizarParentesco);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN]), ParentescoController.removerParentesco);

export default router;
