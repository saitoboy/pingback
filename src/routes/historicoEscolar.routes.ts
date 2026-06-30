import { Router } from 'express';
import { HistoricoEscolarController } from '../controllers/historicoEscolar.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

// ================ ROTAS BÁSICAS HISTÓRICO ESCOLAR ================

/**
 * @openapi
 * /historico-escolar:
 *   get:
 *     tags: [Histórico Escolar]
 *     summary: Listar históricos escolares (ADMIN/SECRETARIO)
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/HistoricoEscolar' } }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *   post:
 *     tags: [Histórico Escolar]
 *     summary: Criar histórico escolar (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HistoricoEscolarInput' }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/HistoricoEscolar' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  HistoricoEscolarController.listarTodos
);

/**
 * @openapi
 * /historico-escolar/{historico_escolar_id}:
 *   get:
 *     tags: [Histórico Escolar]
 *     summary: Buscar histórico escolar por ID (ADMIN/SECRETARIO/PROFESSOR)
 *     parameters:
 *       - { in: path, name: historico_escolar_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Histórico
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/HistoricoEscolar' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Histórico Escolar]
 *     summary: Atualizar histórico escolar (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: historico_escolar_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HistoricoEscolarInput' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/HistoricoEscolar' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Histórico Escolar]
 *     summary: Excluir histórico escolar (apenas ADMIN)
 *     parameters:
 *       - { in: path, name: historico_escolar_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:historico_escolar_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  HistoricoEscolarController.buscarPorId
);

router.post('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  HistoricoEscolarController.criar
);

router.put('/:historico_escolar_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  HistoricoEscolarController.atualizar
);

router.delete('/:historico_escolar_id',
  autorizarPor([TipoUsuario.ADMIN]),
  HistoricoEscolarController.excluir
);

// ================ ROTAS DE CONSULTA POR RELACIONAMENTO ================

/**
 * @openapi
 * /historico-escolar/matricula/{matricula_aluno_id}:
 *   get:
 *     tags: [Histórico Escolar]
 *     summary: Buscar históricos por matrícula
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Históricos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/HistoricoEscolar' } }
 */
router.get('/matricula/:matricula_aluno_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  HistoricoEscolarController.buscarPorMatricula
);

/**
 * @openapi
 * /historico-escolar/ano-letivo/{ano_letivo_id}:
 *   get:
 *     tags: [Histórico Escolar]
 *     summary: Buscar históricos por ano letivo
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Históricos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/HistoricoEscolar' } }
 */
router.get('/ano-letivo/:ano_letivo_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  HistoricoEscolarController.buscarPorAnoLetivo
);

// ================ ROTAS ESPECIAIS ================

/**
 * @openapi
 * /historico-escolar/completo/{historico_escolar_id}:
 *   get:
 *     tags: [Histórico Escolar]
 *     summary: Buscar histórico completo (com boletins)
 *     parameters:
 *       - { in: path, name: historico_escolar_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Histórico completo
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/completo/:historico_escolar_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  HistoricoEscolarController.buscarCompleto
);

/**
 * @openapi
 * /historico-escolar/gerar-automatico:
 *   post:
 *     tags: [Histórico Escolar]
 *     summary: Gerar histórico automático baseado nos boletins (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula_aluno_id: { type: string, format: uuid }
 *               ano_letivo_id: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Histórico gerado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.post('/gerar-automatico',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  HistoricoEscolarController.gerarAutomatico
);

// ================ ROTAS DE RELATÓRIOS ================

/**
 * @openapi
 * /historico-escolar/relatorio/matricula/{matricula_aluno_id}:
 *   get:
 *     tags: [Histórico Escolar]
 *     summary: Relatório completo da matrícula (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Relatório
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/relatorio/matricula/:matricula_aluno_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  HistoricoEscolarController.gerarRelatorioMatricula
);

export default router;
