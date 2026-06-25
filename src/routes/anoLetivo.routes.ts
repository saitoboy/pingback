import { Router } from 'express';
import AnoLetivoController from '../controllers/anoLetivo.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /ano-letivo:
 *   get:
 *     tags: [Ano Letivo]
 *     summary: Listar anos letivos
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/AnoLetivo' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Ano Letivo]
 *     summary: Criar ano letivo (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AnoLetivoInput' }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AnoLetivo' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', AnoLetivoController.listarAnosLetivos);

/**
 * @openapi
 * /ano-letivo/ano/{ano}:
 *   get:
 *     tags: [Ano Letivo]
 *     summary: Buscar ano letivo pelo ano
 *     parameters:
 *       - { in: path, name: ano, required: true, schema: { type: integer } }
 *     responses:
 *       200:
 *         description: Ano letivo
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AnoLetivo' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/ano/:ano', AnoLetivoController.buscarAnoLetivoPorAno);

/**
 * @openapi
 * /ano-letivo/{ano_letivo_id}:
 *   get:
 *     tags: [Ano Letivo]
 *     summary: Buscar ano letivo por ID
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Ano letivo
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AnoLetivo' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Ano Letivo]
 *     summary: Atualizar ano letivo (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AnoLetivoInput' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AnoLetivo' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Ano Letivo]
 *     summary: Deletar ano letivo (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:ano_letivo_id', AnoLetivoController.buscarAnoLetivoPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AnoLetivoController.criarAnoLetivo);
router.put('/:ano_letivo_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AnoLetivoController.atualizarAnoLetivo);
router.delete('/:ano_letivo_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AnoLetivoController.deletarAnoLetivo);

export default router;
