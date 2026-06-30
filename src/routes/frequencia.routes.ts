import { Router } from 'express';
import { FrequenciaController } from '../controllers/frequencia.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

/**
 * @openapi
 * /frequencia:
 *   get:
 *     tags: [Frequência]
 *     summary: Listar frequências (ADMIN/SECRETARIO/PROFESSOR)
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Frequencia' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Frequência]
 *     summary: Criar frequência (ADMIN/SECRETARIO/PROFESSOR)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/FrequenciaInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Frequencia' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.listarTodas
);

/**
 * @openapi
 * /frequencia/detalhes:
 *   get:
 *     tags: [Frequência]
 *     summary: Listar frequências com detalhes
 *     responses:
 *       200:
 *         description: Lista detalhada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/detalhes',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarComDetalhes
);

/**
 * @openapi
 * /frequencia/detalhes/{frequencia_id}:
 *   get:
 *     tags: [Frequência]
 *     summary: Buscar frequência com detalhes por ID
 *     parameters:
 *       - { in: path, name: frequencia_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Frequência detalhada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/detalhes/:frequencia_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarComDetalhes
);

/**
 * @openapi
 * /frequencia/matricula/{matricula_aluno_id}:
 *   get:
 *     tags: [Frequência]
 *     summary: Buscar frequências por matrícula
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Frequências
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Frequencia' } }
 */
router.get('/matricula/:matricula_aluno_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorMatricula
);

/**
 * @openapi
 * /frequencia/aluno/{aluno_id}:
 *   get:
 *     tags: [Frequência]
 *     summary: Buscar frequências por aluno
 *     parameters:
 *       - { in: path, name: aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Frequências
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Frequencia' } }
 */
router.get('/aluno/:aluno_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorAluno
);

/**
 * @openapi
 * /frequencia/aula/{aula_id}:
 *   get:
 *     tags: [Frequência]
 *     summary: Buscar frequências por aula
 *     parameters:
 *       - { in: path, name: aula_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Frequências
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Frequencia' } }
 */
router.get('/aula/:aula_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorAula
);

/**
 * @openapi
 * /frequencia/turma/{turma_id}/data/{data_aula}:
 *   get:
 *     tags: [Frequência]
 *     summary: Buscar frequências por turma e data
 *     parameters:
 *       - { in: path, name: turma_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: data_aula, required: true, schema: { type: string, format: date } }
 *       - { in: query, name: disciplina_id, required: false, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Frequências
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Frequencia' } }
 */
router.get('/turma/:turma_id/data/:data_aula',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorTurmaEData
);

/**
 * @openapi
 * /frequencia/estatisticas/aluno/{aluno_id}:
 *   get:
 *     tags: [Frequência]
 *     summary: Estatísticas de frequência por aluno
 *     parameters:
 *       - { in: path, name: aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/estatisticas/aluno/:aluno_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.obterEstatisticasPorAluno
);

/**
 * @openapi
 * /frequencia/estatisticas/turma/{turma_id}/disciplina/{disciplina_id}:
 *   get:
 *     tags: [Frequência]
 *     summary: Estatísticas por turma e disciplina
 *     parameters:
 *       - { in: path, name: turma_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: disciplina_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: query, name: data_inicio, required: false, schema: { type: string, format: date } }
 *       - { in: query, name: data_fim, required: false, schema: { type: string, format: date } }
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/estatisticas/turma/:turma_id/disciplina/:disciplina_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.obterEstatisticasPorTurmaDisciplina
);

router.post('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.criar
);

/**
 * @openapi
 * /frequencia/lote:
 *   post:
 *     tags: [Frequência]
 *     summary: Registrar frequência em lote para uma aula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aula_id: { type: string, format: uuid }
 *               frequencias:
 *                 type: array
 *                 items: { $ref: '#/components/schemas/FrequenciaInput' }
 *     responses:
 *       201:
 *         description: Frequências registradas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.post('/lote',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.registrarFrequenciaLote
);

/**
 * @openapi
 * /frequencia/professor/{professor_id}/turma/{turma_id}/data/{data}:
 *   get:
 *     tags: [Frequência]
 *     summary: Buscar frequências por professor, turma e data
 *     parameters:
 *       - { in: path, name: professor_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: turma_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: data, required: true, schema: { type: string, format: date } }
 *     responses:
 *       200:
 *         description: Frequências
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Frequencia' } }
 */
router.get('/professor/:professor_id/turma/:turma_id/data/:data',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorProfessorTurmaEData
);

/**
 * @openapi
 * /frequencia/lote-por-professor-turma-data:
 *   post:
 *     tags: [Frequência]
 *     summary: Registrar frequência em lote por professor, turma e data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Sucesso' }
 *     responses:
 *       201:
 *         description: Registrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.post('/lote-por-professor-turma-data',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.registrarFrequenciaLotePorProfessorTurmaEData
);

/**
 * @openapi
 * /frequencia/data/{vinculacaoId}/{data}:
 *   get:
 *     tags: [Frequência]
 *     deprecated: true
 *     summary: (DEPRECATED) Buscar frequências por data e vinculação
 *     parameters:
 *       - { in: path, name: vinculacaoId, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: data, required: true, schema: { type: string, format: date } }
 *     responses:
 *       200:
 *         description: Frequências
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Frequencia' } }
 */
router.get('/data/:vinculacaoId/:data',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorDataEVinculacao
);

/**
 * @openapi
 * /frequencia/lote-por-data:
 *   post:
 *     tags: [Frequência]
 *     deprecated: true
 *     summary: (DEPRECATED) Registrar frequência em lote por data e vinculação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Sucesso' }
 *     responses:
 *       201:
 *         description: Registrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.post('/lote-por-data',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.registrarFrequenciaLotePorData
);

/**
 * @openapi
 * /frequencia/{frequencia_id}:
 *   get:
 *     tags: [Frequência]
 *     summary: Buscar frequência por ID
 *     parameters:
 *       - { in: path, name: frequencia_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Frequência
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Frequencia' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Frequência]
 *     summary: Atualizar frequência (ADMIN/SECRETARIO/PROFESSOR)
 *     parameters:
 *       - { in: path, name: frequencia_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/FrequenciaInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Frequencia' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Frequência]
 *     summary: Deletar frequência (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: frequencia_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.put('/:frequencia_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.atualizar
);

router.delete('/:frequencia_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  FrequenciaController.deletar
);

router.get('/:frequencia_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  FrequenciaController.buscarPorId
);

export default router;
