import { Router } from 'express';
import { AtividadeController } from '../controllers/atividade.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

// GET /api/atividade - Listar todas as atividades
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.listarTodas
);

// GET /api/atividade/detalhes - Listar atividades com detalhes
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/detalhes', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarComDetalhes
);

// GET /api/atividade/detalhes/:atividade_id - Buscar atividade com detalhes por ID
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/detalhes/:atividade_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarComDetalhes
);

// GET /api/atividade/avaliativas - Buscar atividades que valem nota
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/avaliativas', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarQueValemNota
);

// GET /api/atividade/aula/:aula_id - Buscar atividades por aula
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/aula/:aula_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarPorAula
);

// GET /api/atividade/vinculacao/:turma_disciplina_professor_id - Buscar atividades por vinculação
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/vinculacao/:turma_disciplina_professor_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarPorVinculacao
);

// GET /api/atividade/periodo/:periodo_letivo_id - Buscar atividades por período
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/periodo/:periodo_letivo_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarPorPeriodo
);

// GET /api/atividade/estatisticas/professor/:professor_id - Estatísticas por professor
// Permissões: ADMIN, PROFESSOR (suas próprias estatísticas)
router.get('/estatisticas/professor/:professor_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  AtividadeController.estatisticasPorProfessor
);

// POST /api/atividade - Criar nova atividade
// Permissões: ADMIN, PROFESSOR (Professor só pode criar atividades para suas aulas)
router.post('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  AtividadeController.criar
);

// PUT /api/atividade/:atividade_id - Atualizar atividade
// Permissões: ADMIN, PROFESSOR (Professor só pode atualizar suas próprias atividades)
router.put('/:atividade_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  AtividadeController.atualizar
);

// DELETE /api/atividade/:atividade_id - Deletar atividade
// Permissões: ADMIN, PROFESSOR (Professor só pode deletar suas próprias atividades)
router.delete('/:atividade_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  AtividadeController.deletar
);

// GET /api/atividade/:atividade_id - Buscar atividade por ID (deve ficar por último)
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/:atividade_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarPorId
);

export default router;
