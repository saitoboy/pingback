import { Router } from 'express';
import { ReligiaoController } from '../controllers/religiao.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', ReligiaoController.listarReligioes);
router.get('/:id', ReligiaoController.buscarReligiaoPorId);

// Rotas que precisam de permissão de ADMIN ou SECRETARIO
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ReligiaoController.criarReligiao);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ReligiaoController.atualizarReligiao);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ReligiaoController.removerReligiao);

export default router;
