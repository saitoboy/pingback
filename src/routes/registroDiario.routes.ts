import { Router } from 'express';
import RegistroDiarioController from '../controllers/registroDiario.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /registro-diario/professor/{professorId}:
 *   get:
 *     tags: [Registro Diário]
 *     summary: Listar registros de um professor (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: professorId, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Registros
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/RegistroDiario' } }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get(
  '/professor/:professorId',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  RegistroDiarioController.listarPorProfessor
);

/**
 * @openapi
 * /registro-diario/vinculacao/{vinculacaoId}:
 *   get:
 *     tags: [Registro Diário]
 *     summary: Listar registros de uma vinculação (timeline)
 *     parameters:
 *       - { in: path, name: vinculacaoId, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Registros
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/RegistroDiario' } }
 */
router.get('/vinculacao/:vinculacaoId', RegistroDiarioController.listarPorVinculacao);

/**
 * @openapi
 * /registro-diario/data/{vinculacaoId}/{data}:
 *   get:
 *     tags: [Registro Diário]
 *     summary: Buscar registro de um dia específico
 *     parameters:
 *       - { in: path, name: vinculacaoId, required: true, schema: { type: string, format: uuid } }
 *       - { in: path, name: data, required: true, schema: { type: string, format: date } }
 *     responses:
 *       200:
 *         description: Registro
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/RegistroDiario' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/data/:vinculacaoId/:data', RegistroDiarioController.buscarPorDataEVinculacao);

/**
 * @openapi
 * /registro-diario:
 *   post:
 *     tags: [Registro Diário]
 *     summary: Criar ou atualizar o registro do dia (ADMIN/PROFESSOR)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegistroDiarioInput' }
 *     responses:
 *       200:
 *         description: Salvo
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/RegistroDiario' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), RegistroDiarioController.salvar);

/**
 * @openapi
 * /registro-diario/{id}:
 *   put:
 *     tags: [Registro Diário]
 *     summary: Atualizar registro por ID (ADMIN/PROFESSOR)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegistroDiarioInput' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/RegistroDiario' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Registro Diário]
 *     summary: Deletar registro (ADMIN/PROFESSOR)
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), RegistroDiarioController.atualizar);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), RegistroDiarioController.deletar);

export default router;
