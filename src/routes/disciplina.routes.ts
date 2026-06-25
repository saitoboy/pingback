import { Router } from 'express';
import DisciplinaController from '../controllers/disciplina.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /disciplina:
 *   get:
 *     tags: [Disciplina]
 *     summary: Listar disciplinas
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Disciplina' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Disciplina]
 *     summary: Criar disciplina (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DisciplinaInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Disciplina' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', DisciplinaController.listarDisciplinas);

/**
 * @openapi
 * /disciplina/{id}:
 *   get:
 *     tags: [Disciplina]
 *     summary: Buscar disciplina por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Disciplina
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Disciplina' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Disciplina]
 *     summary: Atualizar disciplina (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DisciplinaInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Disciplina' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Disciplina]
 *     summary: Deletar disciplina (apenas ADMIN)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', DisciplinaController.buscarDisciplinaPorId);

/**
 * @openapi
 * /disciplina/buscar/{nome}:
 *   get:
 *     tags: [Disciplina]
 *     summary: Buscar disciplinas por nome
 *     parameters:
 *       - { in: path, name: nome, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Disciplinas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Disciplina' } }
 */
router.get('/buscar/:nome', DisciplinaController.buscarDisciplinasPorNome);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DisciplinaController.criarDisciplina);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DisciplinaController.atualizarDisciplina);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN]), DisciplinaController.deletarDisciplina);

export default router;
