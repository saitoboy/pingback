import { Router } from 'express';
import FeriadoController from '../controllers/feriado.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /feriado/ano/{ano_letivo_id}:
 *   get:
 *     tags: [Feriado]
 *     summary: Listar feriados de um ano letivo
 *     parameters:
 *       - { in: path, name: ano_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Feriados
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 */
router.get('/ano/:ano_letivo_id', FeriadoController.listarPorAno);

/**
 * @openapi
 * /feriado:
 *   post:
 *     tags: [Feriado]
 *     summary: Criar feriado (apenas ADMIN)
 *     responses:
 *       201: { description: Criado }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       409: { description: Já existe feriado nessa data }
 */
router.post('/', autorizarPor([TipoUsuario.ADMIN]), FeriadoController.criar);

/**
 * @openapi
 * /feriado/{feriado_id}:
 *   delete:
 *     tags: [Feriado]
 *     summary: Deletar feriado (apenas ADMIN)
 *     parameters:
 *       - { in: path, name: feriado_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.delete('/:feriado_id', autorizarPor([TipoUsuario.ADMIN]), FeriadoController.deletar);

export default router;
