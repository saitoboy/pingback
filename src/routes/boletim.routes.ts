import { Router } from 'express';
import { BoletimController } from '../controllers/boletim.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

// ================ ROTAS BÁSICAS BOLETIM ================

// GET /api/boletim - Listar todos os boletins
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.listarTodos
);

// GET /api/boletim/detalhes - Listar boletins com detalhes
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/detalhes', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.listarComDetalhes
);

// GET /api/boletim/detalhes/:boletim_id - Buscar boletim com detalhes por ID
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/detalhes/:boletim_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarComDetalhes
);

// GET /api/boletim/:boletim_id - Buscar boletim por ID
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/:boletim_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarPorId
);

// POST /api/boletim - Criar novo boletim
// Permissões: ADMIN, SECRETARIO
router.post('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  BoletimController.criar
);

// PUT /api/boletim/:boletim_id - Atualizar boletim
// Permissões: ADMIN, SECRETARIO
router.put('/:boletim_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  BoletimController.atualizar
);

// DELETE /api/boletim/:boletim_id - Excluir boletim
// Permissões: ADMIN
router.delete('/:boletim_id', 
  autorizarPor([TipoUsuario.ADMIN]),
  BoletimController.excluir
);

// ================ ROTAS DE CONSULTA POR RELACIONAMENTO ================

// GET /api/boletim/matricula/:matricula_aluno_id - Buscar boletins por matrícula
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/matricula/:matricula_aluno_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarPorMatricula
);

// GET /api/boletim/periodo/:periodo_letivo_id - Buscar boletins por período letivo
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/periodo/:periodo_letivo_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarPorPeriodo
);

// ================ ROTAS BOLETIM DISCIPLINA ================

// GET /api/boletim/:boletim_id/disciplinas - Listar disciplinas do boletim
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/:boletim_id/disciplinas', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.listarDisciplinasBoletim
);

// GET /api/boletim/disciplina/:boletim_disciplina_id - Buscar disciplina do boletim por ID
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/disciplina/:boletim_disciplina_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarDisciplinaPorId
);

// POST /api/boletim/disciplina - Criar disciplina do boletim
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.post('/disciplina', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.criarDisciplinaBoletim
);

// PUT /api/boletim/disciplina/:boletim_disciplina_id - Atualizar disciplina do boletim
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.put('/disciplina/:boletim_disciplina_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.atualizarDisciplinaBoletim
);

// DELETE /api/boletim/disciplina/:boletim_disciplina_id - Excluir disciplina do boletim
// Permissões: ADMIN, SECRETARIO
router.delete('/disciplina/:boletim_disciplina_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  BoletimController.excluirDisciplinaBoletim
);

// ================ ROTAS ESPECIAIS ================

// GET /api/boletim/completo/:boletim_id - Buscar boletim completo (com todas as disciplinas)
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/completo/:boletim_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarBoletimCompleto
);

// GET /api/boletim/estatisticas - Gerar estatísticas dos boletins
// Permissões: ADMIN, SECRETARIO
router.get('/estatisticas', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  BoletimController.gerarEstatisticas
);

// POST /api/boletim/gerar-automatico - Gerar boletim automático baseado nas médias
// Permissões: ADMIN, SECRETARIO
router.post('/gerar-automatico', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  BoletimController.gerarBoletimAutomatico
);

export default router;
