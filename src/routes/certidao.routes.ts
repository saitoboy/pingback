import { Router } from 'express';
import { CertidaoController } from '../controllers/certidao.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /certidao:
 *   get:
 *     tags: [Certidão]
 *     summary: Listar certidões
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/CertidaoNascimento' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Certidão]
 *     summary: Criar certidão (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CertidaoInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CertidaoNascimento' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', CertidaoController.listarCertidoes);

/**
 * @openapi
 * /certidao/{id}:
 *   get:
 *     tags: [Certidão]
 *     summary: Buscar certidão por ID
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Certidão
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CertidaoNascimento' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Certidão]
 *     summary: Atualizar certidão (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CertidaoInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CertidaoNascimento' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Certidão]
 *     summary: Remover certidão (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:id', CertidaoController.buscarCertidaoPorId);

/**
 * @openapi
 * /certidao/matricula/{matricula}:
 *   get:
 *     tags: [Certidão]
 *     summary: Buscar certidão por matrícula
 *     parameters:
 *       - { in: path, name: matricula, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Certidão
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CertidaoNascimento' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/matricula/:matricula', CertidaoController.buscarCertidaoPorMatricula);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), CertidaoController.criarCertidao);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), CertidaoController.atualizarCertidao);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), CertidaoController.removerCertidao);

export default router;
