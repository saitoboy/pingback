import { Router } from 'express';
import AulaController from '../controllers/aula.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /aula:
 *   get:
 *     tags: [Aula]
 *     summary: Listar aulas (ADMIN/SECRETARIO/PROFESSOR)
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Aula' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Aula]
 *     summary: Criar aula (ADMIN/SECRETARIO/PROFESSOR)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AulaInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Aula' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.listarTodas);

/**
 * @openapi
 * /aula/detalhes/{aula_id}:
 *   get:
 *     tags: [Aula]
 *     summary: Buscar aula com detalhes (ADMIN/SECRETARIO/PROFESSOR)
 *     parameters:
 *       - { in: path, name: aula_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Aula detalhada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/detalhes/:aula_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.buscarComDetalhes);

/**
 * @openapi
 * /aula/vinculacao/{turma_disciplina_professor_id}:
 *   get:
 *     tags: [Aula]
 *     summary: Buscar aulas por vinculação (ADMIN/SECRETARIO/PROFESSOR)
 *     parameters:
 *       - { in: path, name: turma_disciplina_professor_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Aulas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Aula' } }
 */
router.get('/vinculacao/:turma_disciplina_professor_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.buscarPorVinculacao);

/**
 * @openapi
 * /aula/{aula_id}:
 *   get:
 *     tags: [Aula]
 *     summary: Buscar aula por ID (ADMIN/SECRETARIO/PROFESSOR)
 *     parameters:
 *       - { in: path, name: aula_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Aula
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Aula' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Aula]
 *     summary: Atualizar aula (ADMIN/SECRETARIO/PROFESSOR)
 *     parameters:
 *       - { in: path, name: aula_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AulaInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Aula' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Aula]
 *     summary: Deletar aula (ADMIN/SECRETARIO/PROFESSOR)
 *     parameters:
 *       - { in: path, name: aula_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:aula_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.buscarPorId);
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.criar);
router.put('/:aula_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.atualizar);
router.delete('/:aula_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]), AulaController.deletar);

export default router;
