import { Router } from 'express';
import ConteudoAulaController from '../controllers/conteudoAula.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /conteudo-aula:
 *   get:
 *     tags: [Conteúdo de Aula]
 *     summary: Listar conteúdos de aula
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/ConteudoAula' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Conteúdo de Aula]
 *     summary: Criar conteúdo (ADMIN/PROFESSOR)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ConteudoAulaInput' }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ConteudoAula' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', ConteudoAulaController.listarConteudos);

/**
 * @openapi
 * /conteudo-aula/aula/{aula_id}:
 *   get:
 *     tags: [Conteúdo de Aula]
 *     summary: Buscar conteúdos por aula
 *     parameters:
 *       - { in: path, name: aula_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Conteúdos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/ConteudoAula' } }
 */
router.get('/aula/:aula_id', ConteudoAulaController.buscarConteudosPorAula);

/**
 * @openapi
 * /conteudo-aula/data/{vinculacaoId}/{data}:
 *   get:
 *     tags: [Conteúdo de Aula]
 *     summary: Buscar conteúdos por data e vinculação
 *     parameters:
 *       - { in: path, name: vinculacaoId, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: data, required: true, schema: { type: string, format: date } }
 *     responses:
 *       200:
 *         description: Conteúdos
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/ConteudoAula' } }
 */
router.get('/data/:vinculacaoId/:data', ConteudoAulaController.buscarConteudosPorDataEVinculacao);

/**
 * @openapi
 * /conteudo-aula/{id}:
 *   get:
 *     tags: [Conteúdo de Aula]
 *     summary: Buscar conteúdo por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Conteúdo
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ConteudoAula' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Conteúdo de Aula]
 *     summary: Atualizar conteúdo (ADMIN/PROFESSOR)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ConteudoAulaInput' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ConteudoAula' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Conteúdo de Aula]
 *     summary: Deletar conteúdo (ADMIN/PROFESSOR)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', ConteudoAulaController.buscarConteudoPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), ConteudoAulaController.criarConteudo);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), ConteudoAulaController.atualizarConteudo);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), ConteudoAulaController.deletarConteudo);

export default router;
