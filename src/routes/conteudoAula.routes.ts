import { Router } from 'express';
import ConteudoAulaController from '../controllers/conteudoAula.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// GET /conteudo-aula - Listar todos os conteúdos (todos podem ver)
router.get('/', ConteudoAulaController.listarConteudos);

// GET /conteudo-aula/:id - Buscar por ID (todos podem ver)
router.get('/:id', ConteudoAulaController.buscarConteudoPorId);

// GET /conteudo-aula/aula/:aula_id - Buscar por aula (todos podem ver)
router.get('/aula/:aula_id', ConteudoAulaController.buscarConteudosPorAula);

// POST /conteudo-aula - Criar conteúdo (ADMIN e PROFESSOR - SEM SECRETARIO)
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), ConteudoAulaController.criarConteudo);

// PUT /conteudo-aula/:id - Atualizar conteúdo (ADMIN e PROFESSOR - SEM SECRETARIO)
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), ConteudoAulaController.atualizarConteudo);

// DELETE /conteudo-aula/:id - Deletar conteúdo (ADMIN e PROFESSOR - professor só pode deletar seus próprios conteúdos)
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), ConteudoAulaController.deletarConteudo);

export default router;
