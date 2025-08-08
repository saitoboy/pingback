import { Router } from 'express';
import TurmaDisciplinaProfessorController from '../controllers/turmaDisciplinaProfessor.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

router.use(autenticar);

// GET /vinculacao - Listar todas as vinculações (todos podem ver)
router.get('/', TurmaDisciplinaProfessorController.listarVinculacoes);

// GET /vinculacao/:id - Buscar por ID (todos podem ver)
router.get('/:id', TurmaDisciplinaProfessorController.buscarVinculacaoPorId);

// POST /vinculacao - Criar vinculação (ADMIN e SECRETARIO)
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), TurmaDisciplinaProfessorController.criarVinculacao);

// DELETE /vinculacao/:id - Deletar vinculação (apenas ADMIN)
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN]), TurmaDisciplinaProfessorController.deletarVinculacao);

export default router;
