import { Router } from 'express';
import DiagnosticoController from '../controllers/diagnostico.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /diagnostico:
 *   get:
 *     tags: [Diagnóstico]
 *     summary: Listar diagnósticos
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Diagnostico' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Diagnóstico]
 *     summary: Criar diagnóstico (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Diagnostico' }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Diagnostico' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', DiagnosticoController.listarDiagnosticos);

/**
 * @openapi
 * /diagnostico/aluno/{aluno_id}:
 *   get:
 *     tags: [Diagnóstico]
 *     summary: Buscar diagnóstico por aluno
 *     parameters:
 *       - { in: path, name: aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Diagnóstico
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Diagnostico' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/aluno/:aluno_id', DiagnosticoController.buscarDiagnosticoPorAluno);

/**
 * @openapi
 * /diagnostico/{diagnostico_id}:
 *   get:
 *     tags: [Diagnóstico]
 *     summary: Buscar diagnóstico por ID
 *     parameters:
 *       - { in: path, name: diagnostico_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Diagnóstico
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Diagnostico' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Diagnóstico]
 *     summary: Atualizar diagnóstico (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: diagnostico_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Diagnostico' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Diagnostico' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Diagnóstico]
 *     summary: Deletar diagnóstico (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: diagnostico_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:diagnostico_id', DiagnosticoController.buscarDiagnosticoPorId);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DiagnosticoController.criarDiagnostico);
router.put('/:diagnostico_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DiagnosticoController.atualizarDiagnostico);
router.delete('/:diagnostico_id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), DiagnosticoController.deletarDiagnostico);

export default router;
