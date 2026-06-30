import { Router } from 'express';
import { MediaDisciplinaBimestreController } from '../controllers/mediaDisciplinaBimestre.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

/**
 * @openapi
 * /media-disciplina-bimestre:
 *   get:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Listar médias (ADMIN/SECRETARIO/PROFESSOR)
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MediaDisciplinaBimestre' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Criar média (ADMIN/SECRETARIO/PROFESSOR)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MediaDisciplinaBimestreInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MediaDisciplinaBimestre' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.listarTodas
);

/**
 * @openapi
 * /media-disciplina-bimestre/detalhes:
 *   get:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Listar médias com detalhes
 *     responses:
 *       200:
 *         description: Lista detalhada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/detalhes',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarComDetalhes
);

/**
 * @openapi
 * /media-disciplina-bimestre/detalhes/{media_disciplina_bimestre_id}:
 *   get:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Buscar média com detalhes por ID
 *     parameters:
 *       - { in: path, name: media_disciplina_bimestre_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Média detalhada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/detalhes/:media_disciplina_bimestre_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarComDetalhes
);

/**
 * @openapi
 * /media-disciplina-bimestre/matricula/{matricula_aluno_id}:
 *   get:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Buscar médias por matrícula
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Médias
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MediaDisciplinaBimestre' } }
 */
router.get('/matricula/:matricula_aluno_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarPorMatricula
);

/**
 * @openapi
 * /media-disciplina-bimestre/aluno/{aluno_id}:
 *   get:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Buscar médias por aluno
 *     parameters:
 *       - { in: path, name: aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Médias
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MediaDisciplinaBimestre' } }
 */
router.get('/aluno/:aluno_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarPorAluno
);

/**
 * @openapi
 * /media-disciplina-bimestre/turma/{turma_id}/disciplina/{disciplina_id}:
 *   get:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Buscar médias por turma e disciplina
 *     parameters:
 *       - { in: path, name: turma_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: disciplina_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Médias
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MediaDisciplinaBimestre' } }
 */
router.get('/turma/:turma_id/disciplina/:disciplina_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarPorTurmaEDisciplina
);

/**
 * @openapi
 * /media-disciplina-bimestre/periodo-letivo/{periodo_letivo_id}:
 *   get:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Buscar médias por período letivo
 *     parameters:
 *       - { in: path, name: periodo_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Médias
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MediaDisciplinaBimestre' } }
 */
router.get('/periodo-letivo/:periodo_letivo_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarPorPeriodoLetivo
);

/**
 * @openapi
 * /media-disciplina-bimestre/estatisticas/aluno/{aluno_id}/periodo-letivo/{periodo_letivo_id}:
 *   get:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Estatísticas por aluno e período letivo
 *     parameters:
 *       - { in: path, name: aluno_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: periodo_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/estatisticas/aluno/:aluno_id/periodo-letivo/:periodo_letivo_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.obterEstatisticasPorAluno
);

/**
 * @openapi
 * /media-disciplina-bimestre/estatisticas/turma/{turma_id}/disciplina/{disciplina_id}/periodo-letivo/{periodo_letivo_id}:
 *   get:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Estatísticas por turma, disciplina e período letivo
 *     parameters:
 *       - { in: path, name: turma_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: disciplina_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: periodo_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/estatisticas/turma/:turma_id/disciplina/:disciplina_id/periodo-letivo/:periodo_letivo_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.obterEstatisticasPorTurmaDisciplina
);

/**
 * @openapi
 * /media-disciplina-bimestre/{media_disciplina_bimestre_id}:
 *   get:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Buscar média por ID
 *     parameters:
 *       - { in: path, name: media_disciplina_bimestre_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Média
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MediaDisciplinaBimestre' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Atualizar média (ADMIN/SECRETARIO/PROFESSOR)
 *     parameters:
 *       - { in: path, name: media_disciplina_bimestre_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MediaDisciplinaBimestreInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MediaDisciplinaBimestre' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Média Disciplina Bimestre]
 *     summary: Deletar média (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: media_disciplina_bimestre_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:media_disciplina_bimestre_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.buscarPorId
);

router.post('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.criar
);

router.put('/:media_disciplina_bimestre_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  MediaDisciplinaBimestreController.atualizar
);

router.delete('/:media_disciplina_bimestre_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  MediaDisciplinaBimestreController.deletar
);

export default router;
