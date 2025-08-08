import { Router } from 'express';
import DisciplinaController from '../controllers/disciplina.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rota para listar todas as disciplinas (todos os usuários autenticados podem ver)
router.get('/', DisciplinaController.listarDisciplinas);

// Rota para buscar disciplina por ID (todos os usuários autenticados podem ver)
router.get('/:id', DisciplinaController.buscarDisciplinaPorId);

// Rota para buscar disciplinas por nome (todos os usuários autenticados podem buscar)
router.get('/buscar/:nome', DisciplinaController.buscarDisciplinasPorNome);

// Rota para criar nova disciplina (apenas ADMIN e SECRETARIO)
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DisciplinaController.criarDisciplina);

// Rota para atualizar disciplina (apenas ADMIN e SECRETARIO)
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DisciplinaController.atualizarDisciplina);

// Rota para deletar disciplina (apenas ADMIN)
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN]), DisciplinaController.deletarDisciplina);

export default router;
