import { Router } from 'express';
import ProfessorController from '../controllers/professor.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /professor/me:
 *   get:
 *     tags: [Professores]
 *     summary: Buscar perfil do professor autenticado
 *     responses:
 *       200:
 *         description: Perfil
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Professor' }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 */
router.get('/me', ProfessorController.buscarMeuPerfil);

/**
 * @openapi
 * /professor/minhas-turmas:
 *   get:
 *     tags: [Professores]
 *     summary: Listar turmas do professor autenticado
 *     responses:
 *       200:
 *         description: Turmas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Turma' } }
 */
router.get('/minhas-turmas', ProfessorController.listarMinhasTurmas);

/**
 * @openapi
 * /professor:
 *   get:
 *     tags: [Professores]
 *     summary: Listar professores (ADMIN/SECRETARIO)
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Professor' } }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *   post:
 *     tags: [Professores]
 *     summary: Criar professor (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario_id]
 *             properties:
 *               usuario_id: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Professor' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.criar);
router.get('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.listar);

/**
 * @openapi
 * /professor/com-turmas:
 *   get:
 *     tags: [Professores]
 *     summary: Listar professores com suas turmas (ADMIN/SECRETARIO)
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/com-turmas', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.listarComTurmas);

/**
 * @openapi
 * /professor/{professorId}/turmas:
 *   get:
 *     tags: [Professores]
 *     summary: Listar turmas de um professor (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: professorId, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Turmas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Turma' } }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/:professorId/turmas', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.listarTurmasProfessor);

/**
 * @openapi
 * /professor/{professor_id}:
 *   get:
 *     tags: [Professores]
 *     summary: Buscar professor por ID (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: professor_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Professor
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Professor' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Professores]
 *     summary: Deletar professor (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: professor_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:professor_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.buscarPorId);
router.delete('/:professor_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ProfessorController.deletar);

export default router;
