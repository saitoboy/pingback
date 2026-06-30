import { Router } from 'express';
import SerieController from '../controllers/serie.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /serie:
 *   get:
 *     tags: [Série]
 *     summary: Listar séries
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Serie' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Série]
 *     summary: Criar série (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SerieInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Serie' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', SerieController.listarSeries);

/**
 * @openapi
 * /serie/{serie_id}:
 *   get:
 *     tags: [Série]
 *     summary: Buscar série por ID
 *     parameters:
 *       - { in: path, name: serie_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Série
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Serie' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Série]
 *     summary: Atualizar série (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: serie_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SerieInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Serie' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Série]
 *     summary: Remover série (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: serie_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:serie_id', SerieController.buscarSeriePorId);

/**
 * @openapi
 * /serie/nome/{nome}:
 *   get:
 *     tags: [Série]
 *     summary: Buscar série por nome
 *     parameters:
 *       - { in: path, name: nome, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Série(s)
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Serie' } }
 */
router.get('/nome/:nome', SerieController.buscarSeriePorNome);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), SerieController.criarSerie);
router.put('/:serie_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), SerieController.atualizarSerie);
router.delete('/:serie_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), SerieController.deletarSerie);

export default router;
