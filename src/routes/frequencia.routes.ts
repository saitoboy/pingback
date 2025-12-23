import { Router } from 'express';
import { FrequenciaController } from '../controllers/frequencia.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

// GET /api/frequencia - Listar todas as frequências
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.listarTodas
);

// GET /api/frequencia/detalhes - Listar frequências com detalhes
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/detalhes', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarComDetalhes
);

// GET /api/frequencia/detalhes/:frequencia_id - Buscar frequência com detalhes por ID
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/detalhes/:frequencia_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarComDetalhes
);

// GET /api/frequencia/matricula/:matricula_aluno_id - Buscar frequências por matrícula
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/matricula/:matricula_aluno_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorMatricula
);

// GET /api/frequencia/aluno/:aluno_id - Buscar frequências por aluno
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/aluno/:aluno_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorAluno
);

// GET /api/frequencia/aula/:aula_id - Buscar frequências por aula
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/aula/:aula_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorAula
);

// GET /api/frequencia/turma/:turma_id/data/:data_aula - Buscar frequências por turma e data
// Query params opcionais: disciplina_id
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/turma/:turma_id/data/:data_aula', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorTurmaEData
);

// GET /api/frequencia/estatisticas/aluno/:aluno_id - Estatísticas de frequência por aluno
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/estatisticas/aluno/:aluno_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.obterEstatisticasPorAluno
);

// GET /api/frequencia/estatisticas/turma/:turma_id/disciplina/:disciplina_id - Estatísticas por turma e disciplina
// Query params opcionais: data_inicio, data_fim
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/estatisticas/turma/:turma_id/disciplina/:disciplina_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.obterEstatisticasPorTurmaDisciplina
);

// POST /api/frequencia - Criar nova frequência
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.post('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.criar
);

// POST /api/frequencia/lote - Registrar frequência em lote para uma aula
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.post('/lote', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.registrarFrequenciaLote
);

// GET /api/frequencia/professor/:professor_id/turma/:turma_id/data/:data - Buscar frequências por professor, turma e data
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/professor/:professor_id/turma/:turma_id/data/:data', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorProfessorTurmaEData
);

// POST /api/frequencia/lote-por-professor-turma-data - Registrar frequência em lote por professor, turma e data
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.post('/lote-por-professor-turma-data', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.registrarFrequenciaLotePorProfessorTurmaEData
);

// GET /api/frequencia/data/:vinculacaoId/:data - Buscar frequências por data e vinculação (DEPRECATED - manter para compatibilidade)
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/data/:vinculacaoId/:data', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorDataEVinculacao
);

// POST /api/frequencia/lote-por-data - Registrar frequência em lote por data e vinculação (DEPRECATED - manter para compatibilidade)
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.post('/lote-por-data', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.registrarFrequenciaLotePorData
);

// PUT /api/frequencia/:frequencia_id - Atualizar frequência
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.put('/:frequencia_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.atualizar
);

// DELETE /api/frequencia/:frequencia_id - Deletar frequência
// Permissões: ADMIN, SECRETARIO
router.delete('/:frequencia_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  FrequenciaController.deletar
);

// GET /api/frequencia/:frequencia_id - Buscar frequência por ID (deve ficar por último)
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/:frequencia_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorId
);

export default router;
