import { Router } from 'express';
import AulaController from '../controllers/aula.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// GET /aula - Listar todas as aulas (todos podem ver)
router.get('/', AulaController.listarAulas);

// GET /aula/vinculacao/:id - Buscar aulas por vinculação (todos podem ver)
router.get('/vinculacao/:id', AulaController.buscarAulasPorVinculacao);

// GET /aula/data/:data - Buscar aulas por data (todos podem ver)
router.get('/data/:data', AulaController.buscarAulasPorData);

// GET /aula/:id - Buscar aula por ID (todos podem ver)
router.get('/:id', AulaController.buscarAulaPorId);

// POST /aula - Criar nova aula (ADMIN, SECRETARIO e PROFESSOR)
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.criarAula);

// PUT /aula/:id - Atualizar aula (ADMIN, SECRETARIO e PROFESSOR)
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.atualizarAula);

// DELETE /aula/:id - Deletar aula (ADMIN e PROFESSOR - professor só pode deletar suas próprias aulas)
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), AulaController.deletarAula);

export default router;
