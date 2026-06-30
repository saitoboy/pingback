import { Router } from 'express';
import { BoletimController } from '../controllers/boletim.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(autenticar);

// ================ ROTAS BÁSICAS BOLETIM ================

/**
 * @openapi
 * /boletim:
 *   get:
 *     tags: [Boletim]
 *     summary: Listar boletins (ADMIN/SECRETARIO/PROFESSOR)
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Boletim' } }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Boletim]
 *     summary: Criar boletim (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BoletimInput' }
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Boletim' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.listarTodos
);

/**
 * @openapi
 * /boletim/detalhes:
 *   get:
 *     tags: [Boletim]
 *     summary: Listar boletins com detalhes
 *     responses:
 *       200:
 *         description: Lista detalhada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/detalhes',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.listarComDetalhes
);

/**
 * @openapi
 * /boletim/detalhes/{boletim_id}:
 *   get:
 *     tags: [Boletim]
 *     summary: Buscar boletim com detalhes por ID
 *     parameters:
 *       - { in: path, name: boletim_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Boletim detalhado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/detalhes/:boletim_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarComDetalhes
);

/**
 * @openapi
 * /boletim/{boletim_id}:
 *   get:
 *     tags: [Boletim]
 *     summary: Buscar boletim por ID
 *     parameters:
 *       - { in: path, name: boletim_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Boletim
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Boletim' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   put:
 *     tags: [Boletim]
 *     summary: Atualizar boletim (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: boletim_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BoletimInput' }
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Boletim' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Boletim]
 *     summary: Excluir boletim (apenas ADMIN)
 *     parameters:
 *       - { in: path, name: boletim_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removido }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/:boletim_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarPorId
);

router.post('/',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  BoletimController.criar
);

router.put('/:boletim_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  BoletimController.atualizar
);

router.delete('/:boletim_id',
  autorizarPor([TipoUsuario.ADMIN]),
  BoletimController.excluir
);

// ================ ROTAS DE CONSULTA POR RELACIONAMENTO ================

/**
 * @openapi
 * /boletim/matricula/{matricula_aluno_id}:
 *   get:
 *     tags: [Boletim]
 *     summary: Buscar boletins por matrícula
 *     parameters:
 *       - { in: path, name: matricula_aluno_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Boletins
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Boletim' } }
 */
router.get('/matricula/:matricula_aluno_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarPorMatricula
);

/**
 * @openapi
 * /boletim/periodo/{periodo_letivo_id}:
 *   get:
 *     tags: [Boletim]
 *     summary: Buscar boletins por período letivo
 *     parameters:
 *       - { in: path, name: periodo_letivo_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Boletins
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Boletim' } }
 */
router.get('/periodo/:periodo_letivo_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarPorPeriodo
);

// ================ ROTAS BOLETIM DISCIPLINA ================

/**
 * @openapi
 * /boletim/{boletim_id}/disciplinas:
 *   get:
 *     tags: [Boletim]
 *     summary: Listar disciplinas de um boletim
 *     parameters:
 *       - { in: path, name: boletim_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Disciplinas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/BoletimDisciplina' } }
 */
router.get('/:boletim_id/disciplinas',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.listarDisciplinasBoletim
);

/**
 * @openapi
 * /boletim/disciplina/{boletim_disciplina_id}:
 *   get:
 *     tags: [Boletim]
 *     summary: Buscar disciplina do boletim por ID
 *     parameters:
 *       - { in: path, name: boletim_disciplina_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Disciplina do boletim
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BoletimDisciplina' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/disciplina/:boletim_disciplina_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarDisciplinaPorId
);

/**
 * @openapi
 * /boletim/disciplina:
 *   post:
 *     tags: [Boletim]
 *     summary: Criar disciplina do boletim (ADMIN/SECRETARIO/PROFESSOR)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BoletimDisciplinaInput' }
 *     responses:
 *       201:
 *         description: Criada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BoletimDisciplina' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.post('/disciplina',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.criarDisciplinaBoletim
);

/**
 * @openapi
 * /boletim/disciplina/{boletim_disciplina_id}:
 *   put:
 *     tags: [Boletim]
 *     summary: Atualizar disciplina do boletim (ADMIN/SECRETARIO/PROFESSOR)
 *     parameters:
 *       - { in: path, name: boletim_disciplina_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BoletimDisciplinaInput' }
 *     responses:
 *       200:
 *         description: Atualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BoletimDisciplina' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 *   delete:
 *     tags: [Boletim]
 *     summary: Excluir disciplina do boletim (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: boletim_disciplina_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Removida }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.put('/disciplina/:boletim_disciplina_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.atualizarDisciplinaBoletim
);

router.delete('/disciplina/:boletim_disciplina_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  BoletimController.excluirDisciplinaBoletim
);

// ================ ROTAS ESPECIAIS ================

/**
 * @openapi
 * /boletim/completo/{boletim_id}:
 *   get:
 *     tags: [Boletim]
 *     summary: Buscar boletim completo (com todas as disciplinas)
 *     parameters:
 *       - { in: path, name: boletim_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Boletim completo
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/completo/:boletim_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO, TipoUsuario.PROFESSOR]),
  BoletimController.buscarBoletimCompleto
);

/**
 * @openapi
 * /boletim/estatisticas:
 *   get:
 *     tags: [Boletim]
 *     summary: Gerar estatísticas dos boletins (ADMIN/SECRETARIO)
 *     responses:
 *       200:
 *         description: Estatísticas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/estatisticas',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  BoletimController.gerarEstatisticas
);

/**
 * @openapi
 * /boletim/gerar-automatico:
 *   post:
 *     tags: [Boletim]
 *     summary: Gerar boletim automático baseado nas médias (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula_aluno_id: { type: string, format: uuid }
 *               periodo_letivo_id: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Boletim gerado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.post('/gerar-automatico',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  BoletimController.gerarBoletimAutomatico
);

export default router;
