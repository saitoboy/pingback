import { Router } from 'express';
import { ReligiaoController } from '../controllers/religiao.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /religiao:
 *   get:
 *     tags: [Religião]
 *     summary: Listar religiões
 *     responses:
 *       200:
 *         description: Lista de religiões
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Religiao' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Religião]
 *     summary: Criar religião (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReligiaoInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Religiao' }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', ReligiaoController.listarReligioes);

/**
 * @openapi
 * /religiao/{id}:
 *   get:
 *     tags: [Religião]
 *     summary: Buscar religião por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Religião
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Religiao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Religião]
 *     summary: Atualizar religião (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReligiaoInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Religiao' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Religião]
 *     summary: Remover religião (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', ReligiaoController.buscarReligiaoPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ReligiaoController.criarReligiao);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ReligiaoController.atualizarReligiao);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), ReligiaoController.removerReligiao);

export default router;
