import { Router } from 'express';
import { AtividadeController } from '../controllers/atividade.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

/**
 * @openapi
 * /atividade:
 *   get:
 *     tags: [Atividade]
 *     summary: Listar atividades (ADMIN/SECRETARIO/PROFESSOR)
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Atividade' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Atividade]
 *     summary: Criar atividade (ADMIN/PROFESSOR)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AtividadeInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Atividade' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.listarTodas
);

/**
 * @openapi
 * /atividade/detalhes:
 *   get:
 *     tags: [Atividade]
 *     summary: Listar atividades com detalhes (ADMIN/SECRETARIO/PROFESSOR)
 *     responses:
 *       200:
 *         description: Lista detalhada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/detalhes',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarComDetalhes
);

/**
 * @openapi
 * /atividade/detalhes/{atividade_id}:
 *   get:
 *     tags: [Atividade]
 *     summary: Buscar atividade com detalhes por ID
 *     parameters:
 *       - { in: path, name: atividade_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Atividade detalhada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/detalhes/:atividade_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarComDetalhes
);

/**
 * @openapi
 * /atividade/avaliativas:
 *   get:
 *     tags: [Atividade]
 *     summary: Buscar atividades que valem nota
 *     responses:
 *       200:
 *         description: Atividades
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Atividade' } }
 */
router.get('/avaliativas',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarQueValemNota
);

/**
 * @openapi
 * /atividade/aula/{aula_id}:
 *   get:
 *     tags: [Atividade]
 *     summary: Buscar atividades por aula
 *     parameters:
 *       - { in: path, name: aula_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Atividades
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Atividade' } }
 */
router.get('/aula/:aula_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarPorAula
);

/**
 * @openapi
 * /atividade/vinculacao/{turma_disciplina_professor_id}:
 *   get:
 *     tags: [Atividade]
 *     summary: Buscar atividades por vinculação
 *     parameters:
 *       - { in: path, name: turma_disciplina_professor_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Atividades
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Atividade' } }
 */
router.get('/vinculacao/:turma_disciplina_professor_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarPorVinculacao
);

/**
 * @openapi
 * /atividade/data/{vinculacaoId}/{data}:
 *   get:
 *     tags: [Atividade]
 *     summary: Buscar atividades por data e vinculação
 *     parameters:
 *       - { in: path, name: vinculacaoId, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: data, required: true, schema: { type: string, format: date } }
 *     responses:
 *       200:
 *         description: Atividades
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Atividade' } }
 */
router.get('/data/:vinculacaoId/:data',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarPorDataEVinculacao
);

/**
 * @openapi
 * /atividade/periodo/{periodo_letivo_id}:
 *   get:
 *     tags: [Atividade]
 *     summary: Buscar atividades por período letivo
 *     parameters:
 *       - { in: path, name: periodo_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Atividades
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Atividade' } }
 */
router.get('/periodo/:periodo_letivo_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarPorPeriodo
);

/**
 * @openapi
 * /atividade/estatisticas/professor/{professor_id}:
 *   get:
 *     tags: [Atividade]
 *     summary: Estatísticas de atividades por professor (ADMIN/PROFESSOR)
 *     parameters:
 *       - { in: path, name: professor_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/estatisticas/professor/:professor_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  AtividadeController.estatisticasPorProfessor
);

router.post('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  AtividadeController.criar
);

/**
 * @openapi
 * /atividade/{atividade_id}:
 *   get:
 *     tags: [Atividade]
 *     summary: Buscar atividade por ID
 *     parameters:
 *       - { in: path, name: atividade_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Atividade
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Atividade' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Atividade]
 *     summary: Atualizar atividade (ADMIN/PROFESSOR)
 *     parameters:
 *       - { in: path, name: atividade_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AtividadeInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Atividade' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Atividade]
 *     summary: Deletar atividade (ADMIN/PROFESSOR)
 *     parameters:
 *       - { in: path, name: atividade_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.put('/:atividade_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  AtividadeController.atualizar
);

router.delete('/:atividade_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  AtividadeController.deletar
);

router.get('/:atividade_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  AtividadeController.buscarPorId
);

export default router;
