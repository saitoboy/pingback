import { Router } from 'express';
import { HistoricoEscolarController } from '../controllers/historicoEscolar.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

// ================ ROTAS BÁSICAS HISTÓRICO ESCOLAR ================

// GET /api/historico-escolar - Listar todos os históricos escolares
// Permissões: ADMIN, SECRETARIO
router.get('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  HistoricoEscolarController.listarTodos
);

// GET /api/historico-escolar/:historico_escolar_id - Buscar histórico escolar por ID
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/:historico_escolar_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  HistoricoEscolarController.buscarPorId
);

// POST /api/historico-escolar - Criar novo histórico escolar
// Permissões: ADMIN, SECRETARIO
router.post('/', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  HistoricoEscolarController.criar
);

// PUT /api/historico-escolar/:historico_escolar_id - Atualizar histórico escolar
// Permissões: ADMIN, SECRETARIO
router.put('/:historico_escolar_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  HistoricoEscolarController.atualizar
);

// DELETE /api/historico-escolar/:historico_escolar_id - Excluir histórico escolar
// Permissões: ADMIN
router.delete('/:historico_escolar_id', 
  autorizarPor([TipoUsuario.ADMIN]),
  HistoricoEscolarController.excluir
);

// ================ ROTAS DE CONSULTA POR RELACIONAMENTO ================

// GET /api/historico-escolar/matricula/:matricula_aluno_id - Buscar históricos por matrícula
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/matricula/:matricula_aluno_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  HistoricoEscolarController.buscarPorMatricula
);

// GET /api/historico-escolar/ano-letivo/:ano_letivo_id - Buscar históricos por ano letivo
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/ano-letivo/:ano_letivo_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  HistoricoEscolarController.buscarPorAnoLetivo
);

// ================ ROTAS ESPECIAIS ================

// GET /api/historico-escolar/completo/:historico_escolar_id - Buscar histórico completo (com boletins)
// Permissões: ADMIN, SECRETARIO, PROFESSOR
router.get('/completo/:historico_escolar_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  HistoricoEscolarController.buscarCompleto
);

// POST /api/historico-escolar/gerar-automatico - Gerar histórico automático baseado nos boletins
// Permissões: ADMIN, SECRETARIO
router.post('/gerar-automatico', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  HistoricoEscolarController.gerarAutomatico
);

// ================ ROTAS DE RELATÓRIOS ================

// GET /api/historico-escolar/relatorio/matricula/:matricula_aluno_id - Relatório completo da matrícula
// Permissões: ADMIN, SECRETARIO
router.get('/relatorio/matricula/:matricula_aluno_id', 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  HistoricoEscolarController.gerarRelatorioMatricula
);

export default router;
