import { Router } from 'express';
import { NotaController } from '../controllers/nota.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

/**
 * @openapi
 * /nota:
 *   get:
 *     tags: [Nota]
 *     summary: Listar notas (ADMIN/SECRETARIO/PROFESSOR)
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Nota' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Nota]
 *     summary: Criar nota (ADMIN/PROFESSOR)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NotaInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Nota' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.listarTodas
);

/**
 * @openapi
 * /nota/detalhes:
 *   get:
 *     tags: [Nota]
 *     summary: Listar notas com detalhes
 *     responses:
 *       200:
 *         description: Lista detalhada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/detalhes',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarComDetalhes
);

/**
 * @openapi
 * /nota/detalhes/{nota_id}:
 *   get:
 *     tags: [Nota]
 *     summary: Buscar nota com detalhes por ID
 *     parameters:
 *       - { in: path, name: nota_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Nota detalhada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/detalhes/:nota_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarComDetalhes
);

/**
 * @openapi
 * /nota/atividade/{atividade_id}:
 *   get:
 *     tags: [Nota]
 *     summary: Buscar notas por atividade
 *     parameters:
 *       - { in: path, name: atividade_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Notas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Nota' } }
 */
router.get('/atividade/:atividade_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarPorAtividade
);

/**
 * @openapi
 * /nota/aluno/{matricula_aluno_id}:
 *   get:
 *     tags: [Nota]
 *     summary: Buscar notas por aluno (matrícula)
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Notas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Nota' } }
 */
router.get('/aluno/:matricula_aluno_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarPorAluno
);

/**
 * @openapi
 * /nota/turma/{turma_id}/disciplina/{disciplina_id}:
 *   get:
 *     tags: [Nota]
 *     summary: Buscar notas por turma e disciplina
 *     parameters:
 *       - { in: path, name: turma_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: disciplina_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Notas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Nota' } }
 */
router.get('/turma/:turma_id/disciplina/:disciplina_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarPorTurmaEDisciplina
);

/**
 * @openapi
 * /nota/estatisticas/aluno/{matricula_aluno_id}:
 *   get:
 *     tags: [Nota]
 *     summary: Estatísticas de notas por aluno
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/estatisticas/aluno/:matricula_aluno_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.estatisticasPorAluno
);

router.post('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  NotaController.criar
);

/**
 * @openapi
 * /nota/lote:
 *   post:
 *     tags: [Nota]
 *     summary: Lançar notas em lote para uma atividade (ADMIN/PROFESSOR)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NotaLoteInput' }
 *     responses:
 *       201:
 *         description: Notas lançadas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.post('/lote',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  NotaController.lancarNotasLote
);

/**
 * @openapi
 * /nota/{nota_id}:
 *   get:
 *     tags: [Nota]
 *     summary: Buscar nota por ID
 *     parameters:
 *       - { in: path, name: nota_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Nota
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Nota' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Nota]
 *     summary: Atualizar nota (ADMIN/PROFESSOR)
 *     parameters:
 *       - { in: path, name: nota_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NotaInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Nota' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Nota]
 *     summary: Deletar nota (ADMIN/PROFESSOR)
 *     parameters:
 *       - { in: path, name: nota_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.put('/:nota_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  NotaController.atualizar
);

router.delete('/:nota_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]),
  NotaController.deletar
);

router.get('/:nota_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  NotaController.buscarPorId
);

export default router;
