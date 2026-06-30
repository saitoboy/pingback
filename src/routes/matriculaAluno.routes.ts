import { Router } from 'express';
import MatriculaAlunoController from '../controllers/matriculaAluno.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /matricula-aluno:
 *   get:
 *     tags: [Matrícula]
 *     summary: Listar matrículas
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MatriculaAluno' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Matrícula]
 *     summary: Criar matrícula (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MatriculaAlunoInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MatriculaAluno' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', MatriculaAlunoController.listarMatriculas);

/**
 * @openapi
 * /matricula-aluno/ra/{ra}:
 *   get:
 *     tags: [Matrícula]
 *     summary: Buscar matrícula por RA
 *     parameters:
 *       - { in: path, name: ra, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Matrícula
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MatriculaAluno' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/ra/:ra', MatriculaAlunoController.buscarMatriculaPorRA);

/**
 * @openapi
 * /matricula-aluno/aluno/{aluno_id}:
 *   get:
 *     tags: [Matrícula]
 *     summary: Buscar matrículas por aluno
 *     parameters:
 *       - { in: path, name: aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Matrículas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MatriculaAluno' } }
 */
router.get('/aluno/:aluno_id', MatriculaAlunoController.buscarMatriculasPorAluno);

/**
 * @openapi
 * /matricula-aluno/turma/{turma_id}:
 *   get:
 *     tags: [Matrícula]
 *     summary: Buscar matrículas por turma
 *     parameters:
 *       - { in: path, name: turma_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Matrículas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MatriculaAluno' } }
 */
router.get('/turma/:turma_id', MatriculaAlunoController.buscarMatriculasPorTurma);

/**
 * @openapi
 * /matricula-aluno/aula/{aula_id}:
 *   get:
 *     tags: [Matrícula]
 *     summary: Buscar alunos matriculados por aula
 *     parameters:
 *       - { in: path, name: aula_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Matrículas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MatriculaAluno' } }
 */
router.get('/aula/:aula_id', MatriculaAlunoController.buscarAlunosPorAula);

/**
 * @openapi
 * /matricula-aluno/ano-letivo/{ano_letivo_id}:
 *   get:
 *     tags: [Matrícula]
 *     summary: Buscar matrículas por ano letivo
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Matrículas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MatriculaAluno' } }
 */
router.get('/ano-letivo/:ano_letivo_id', MatriculaAlunoController.buscarMatriculasPorAnoLetivo);

/**
 * @openapi
 * /matricula-aluno/status/{status}:
 *   get:
 *     tags: [Matrícula]
 *     summary: Buscar matrículas por status
 *     parameters:
 *       - { in: path, name: status, required: true, schema: { type: string, enum: [ativo, transferido, concluido, cancelado] } }
 *     responses:
 *       200:
 *         description: Matrículas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/MatriculaAluno' } }
 */
router.get('/status/:status', MatriculaAlunoController.buscarMatriculasPorStatus);

/**
 * @openapi
 * /matricula-aluno/ativa/{aluno_id}/{ano_letivo_id}:
 *   get:
 *     tags: [Matrícula]
 *     summary: Buscar matrícula ativa de um aluno em um ano letivo
 *     parameters:
 *       - { in: path, name: aluno_id, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Matrícula
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MatriculaAluno' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/ativa/:aluno_id/:ano_letivo_id', MatriculaAlunoController.buscarMatriculaAtivaAluno);

/**
 * @openapi
 * /matricula-aluno/{matricula_aluno_id}:
 *   get:
 *     tags: [Matrícula]
 *     summary: Buscar matrícula por ID
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Matrícula
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MatriculaAluno' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Matrícula]
 *     summary: Atualizar matrícula (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MatriculaAlunoInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MatriculaAluno' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Matrícula]
 *     summary: Deletar matrícula (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:matricula_aluno_id', MatriculaAlunoController.buscarMatriculaPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), MatriculaAlunoController.criarMatricula);
router.put('/:matricula_aluno_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), MatriculaAlunoController.atualizarMatricula);
router.delete('/:matricula_aluno_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), MatriculaAlunoController.deletarMatricula);

/**
 * @openapi
 * /matricula-aluno/{matricula_aluno_id}/transferir:
 *   put:
 *     tags: [Matrícula]
 *     summary: Transferir aluno (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               turma_id: { type: string, format: uuid }
 *               motivo_saida: { type: string }
 *     responses:
 *       200:
 *         description: Transferido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MatriculaAluno' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.put('/:matricula_aluno_id/transferir', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), MatriculaAlunoController.transferirAluno);

/**
 * @openapi
 * /matricula-aluno/{matricula_aluno_id}/finalizar:
 *   put:
 *     tags: [Matrícula]
 *     summary: Finalizar matrícula (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [concluido, cancelado] }
 *               motivo_saida: { type: string }
 *     responses:
 *       200:
 *         description: Finalizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MatriculaAluno' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.put('/:matricula_aluno_id/finalizar', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), MatriculaAlunoController.finalizarMatricula);

export default router;
