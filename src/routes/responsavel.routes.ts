import { Router } from 'express';
import { ResponsavelController } from '../controllers/responsavel.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /responsavel:
 *   get:
 *     tags: [Responsáveis]
 *     summary: Listar responsáveis
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Responsavel' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Responsáveis]
 *     summary: Criar responsável (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ResponsavelInput' }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Responsavel' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', ResponsavelController.listarResponsaveis);

/**
 * @openapi
 * /responsavel/aluno/{aluno_id}:
 *   get:
 *     tags: [Responsáveis]
 *     summary: Listar responsáveis de um aluno
 *     parameters:
 *       - { in: path, name: aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Responsáveis
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Responsavel' } }
 */
router.get('/aluno/:aluno_id', ResponsavelController.listarResponsaveisPorAluno);

/**
 * @openapi
 * /responsavel/cpf/{cpf}:
 *   get:
 *     tags: [Responsáveis]
 *     summary: Buscar responsável por CPF
 *     parameters:
 *       - { in: path, name: cpf, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Responsável
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Responsavel' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/cpf/:cpf', ResponsavelController.buscarResponsavelPorCpf);

/**
 * @openapi
 * /responsavel/{id}:
 *   get:
 *     tags: [Responsáveis]
 *     summary: Buscar responsável por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Responsável
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Responsavel' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Responsáveis]
 *     summary: Atualizar responsável (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ResponsavelInput' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Responsavel' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Responsáveis]
 *     summary: Deletar responsável (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', ResponsavelController.buscarResponsavelPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ResponsavelController.criarResponsavel);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ResponsavelController.atualizarResponsavel);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ResponsavelController.deletarResponsavel);

export default router;
