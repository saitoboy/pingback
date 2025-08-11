import { Router } from 'express';
import { MediaDisciplinaBimestreController } from '../controllers/mediaDisciplinaBimestre.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

// GET /api/media-disciplina-bimestre - Listar todas as médias
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.listarTodas
);

// GET /api/media-disciplina-bimestre/detalhes - Listar médias com detalhes
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/detalhes', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarComDetalhes
);

// GET /api/media-disciplina-bimestre/detalhes/:media_disciplina_bimestre_id - Buscar média com detalhes por ID
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/detalhes/:media_disciplina_bimestre_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarComDetalhes
);

// GET /api/media-disciplina-bimestre/matricula/:matricula_aluno_id - Buscar médias por matrícula
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/matricula/:matricula_aluno_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarPorMatricula
);

// GET /api/media-disciplina-bimestre/aluno/:aluno_id - Buscar médias por aluno
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/aluno/:aluno_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarPorAluno
);

// GET /api/media-disciplina-bimestre/turma/:turma_id/disciplina/:disciplina_id - Buscar médias por turma e disciplina
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/turma/:turma_id/disciplina/:disciplina_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarPorTurmaEDisciplina
);

// GET /api/media-disciplina-bimestre/periodo-letivo/:periodo_letivo_id - Buscar médias por período letivo
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/periodo-letivo/:periodo_letivo_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarPorPeriodoLetivo
);

// GET /api/media-disciplina-bimestre/estatisticas/aluno/:aluno_id/periodo-letivo/:periodo_letivo_id - Estatísticas por aluno
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/estatisticas/aluno/:aluno_id/periodo-letivo/:periodo_letivo_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.obterEstatisticasPorAluno
);

// GET /api/media-disciplina-bimestre/estatisticas/turma/:turma_id/disciplina/:disciplina_id/periodo-letivo/:periodo_letivo_id - Estatísticas por turma e disciplina
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/estatisticas/turma/:turma_id/disciplina/:disciplina_id/periodo-letivo/:periodo_letivo_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.obterEstatisticasPorTurmaDisciplina
);

// GET /api/media-disciplina-bimestre/:media_disciplina_bimestre_id - Buscar média por ID
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/:media_disciplina_bimestre_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarPorId
);

// POST /api/media-disciplina-bimestre - Criar nova média
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.post('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.criar
);

// PUT /api/media-disciplina-bimestre/:media_disciplina_bimestre_id - Atualizar média
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.put('/:media_disciplina_bimestre_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.atualizar
);

// DELETE /api/media-disciplina-bimestre/:media_disciplina_bimestre_id - Deletar média
// Permissões: ADMIN, SECRETARIO
router.delete('/:media_disciplina_bimestre_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  MediaDisciplinaBimestreController.deletar
);

export default router;
