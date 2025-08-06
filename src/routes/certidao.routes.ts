import { Router } from 'express';
import { CertidaoController } from '../controllers/certidao.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', CertidaoController.listarCertidoes);
router.get('/:id', CertidaoController.buscarCertidaoPorId);
router.get('/matricula/:matricula', CertidaoController.buscarCertidaoPorMatricula);

// Rotas que precisam de permissão de ADMIN ou SECRETARIO
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), CertidaoController.criarCertidao);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), CertidaoController.atualizarCertidao);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), CertidaoController.removerCertidao);

export default router;
