import { Router } from 'express';
import SerieController from '../controllers/serie.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', SerieController.listarSeries);
router.get('/:serie_id', SerieController.buscarSeriePorId);
router.get('/nome/:nome', SerieController.buscarSeriePorNome);

// Rotas que precisam de permissão de ADMIN ou SECRETARIO
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), SerieController.criarSerie);
router.put('/:serie_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), SerieController.atualizarSerie);
router.delete('/:serie_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), SerieController.deletarSerie);

export default router;
