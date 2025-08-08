import { Router } from 'express';
import FichaCadastroController from '../controllers/fichaCadastro.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rota para obter modelo/template da ficha (todos os usuários autenticados podem ver)
router.get('/modelo', FichaCadastroController.obterModeloFicha);

// Rota para buscar ficha por RA (todos os usuários autenticados podem consultar)
router.get('/ra/:ra', FichaCadastroController.buscarFichaPorRA);

// Rota para processar ficha cadastro completa (apenas ADMIN e SECRETARIO)
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), FichaCadastroController.processarFichaCadastro);

export default router;
