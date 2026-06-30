import { Router } from 'express';
import { AlunoController } from '../controllers/aluno.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /aluno:
 *   get:
 *     tags: [Alunos]
 *     summary: Listar alunos
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Aluno' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Alunos]
 *     summary: Criar aluno (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AlunoInput' }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Aluno' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', AlunoController.listarAlunos);

/**
 * @openapi
 * /aluno/cpf/{cpf}:
 *   get:
 *     tags: [Alunos]
 *     summary: Buscar aluno por CPF
 *     parameters:
 *       - { in: path, name: cpf, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Aluno
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Aluno' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/cpf/:cpf', AlunoController.buscarAlunoPorCpf);

/**
 * @openapi
 * /aluno/matricula/{numeroMatricula}:
 *   get:
 *     tags: [Alunos]
 *     summary: Buscar aluno por número de matrícula (RA)
 *     parameters:
 *       - { in: path, name: numeroMatricula, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Aluno
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Aluno' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/matricula/:numeroMatricula', AlunoController.buscarAlunoPorMatricula);

/**
 * @openapi
 * /aluno/buscar/nome:
 *   get:
 *     tags: [Alunos]
 *     summary: Buscar alunos por nome
 *     parameters:
 *       - { in: query, name: nome, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Alunos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Aluno' } }
 */
router.get('/buscar/nome', AlunoController.buscarAlunosPorNome);

/**
 * @openapi
 * /aluno/estatisticas/geral:
 *   get:
 *     tags: [Alunos]
 *     summary: Estatísticas gerais de alunos
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/estatisticas/geral', AlunoController.obterEstatisticas);

/**
 * @openapi
 * /aluno/{id}:
 *   get:
 *     tags: [Alunos]
 *     summary: Buscar aluno por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Aluno
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Aluno' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Alunos]
 *     summary: Atualizar aluno (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AlunoInput' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Aluno' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Alunos]
 *     summary: Remover aluno (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', AlunoController.buscarAlunoPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AlunoController.criarAluno);
router.post('/lote', autorizarPor([TipoUsuario.ADMIN]), AlunoController.criarAlunosEmLote);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AlunoController.atualizarAluno);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AlunoController.removerAluno);

export default router;
