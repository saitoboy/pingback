import { Router } from 'express';
import { ParentescoController } from '../controllers/parentesco.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /parentesco:
 *   get:
 *     tags: [Parentesco]
 *     summary: Listar tipos de parentesco
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Parentesco' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Parentesco]
 *     summary: Criar parentesco (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ParentescoInput' }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Parentesco' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', ParentescoController.listarParentescos);

/**
 * @openapi
 * /parentesco/{id}:
 *   get:
 *     tags: [Parentesco]
 *     summary: Buscar parentesco por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Parentesco
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Parentesco' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Parentesco]
 *     summary: Atualizar parentesco (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ParentescoInput' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Parentesco' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Parentesco]
 *     summary: Remover parentesco (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', ParentescoController.buscarParentescoPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ParentescoController.criarParentesco);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ParentescoController.atualizarParentesco);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ParentescoController.removerParentesco);

export default router;
