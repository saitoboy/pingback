import { Router } from 'express';
import { NotaController } from '../controllers/nota.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

// GET /api/nota - Listar todas as notas
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.listarTodas
);

// GET /api/nota/detalhes - Listar notas com detalhes
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/detalhes', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarComDetalhes
);

// GET /api/nota/detalhes/:nota_id - Buscar nota com detalhes por ID
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/detalhes/:nota_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarComDetalhes
);

// GET /api/nota/atividade/:atividade_id - Buscar notas por atividade
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/atividade/:atividade_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarPorAtividade
);

// GET /api/nota/aluno/:matricula_aluno_id - Buscar notas por aluno
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/aluno/:matricula_aluno_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarPorAluno
);

// GET /api/nota/turma/:turma_id/disciplina/:disciplina_id - Buscar notas por turma e disciplina
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/turma/:turma_id/disciplina/:disciplina_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarPorTurmaEDisciplina
);

// GET /api/nota/estatisticas/aluno/:matricula_aluno_id - Estatísticas de notas por aluno
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/estatisticas/aluno/:matricula_aluno_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.estatisticasPorAluno
);

// POST /api/nota - Criar nova nota
// Permissões: ADMIN, PROFESSOR (Professor só pode criar notas para suas atividades)
router.post('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  NotaController.criar
);

// PUT /api/nota/:nota_id - Atualizar nota
// Permissões: ADMIN, PROFESSOR (Professor só pode atualizar notas de suas atividades)
router.put('/:nota_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  NotaController.atualizar
);

// DELETE /api/nota/:nota_id - Deletar nota
// Permissões: ADMIN, PROFESSOR (Professor só pode deletar notas de suas atividades)
router.delete('/:nota_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  NotaController.deletar
);

// GET /api/nota/:nota_id - Buscar nota por ID (deve ficar por último)
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/:nota_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarPorId
);

export default router;
