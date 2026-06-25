import { Router } from 'express';
import ProfessorDisciplinaController from '../controllers/professorDisciplina.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /professor-disciplina/status-pacote-base:
 *   get:
 *     tags: [Professor-Disciplina]
 *     summary: Listar professores que já têm o pacote base completo
 *     responses:
 *       200:
 *         description: Professores
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 */
router.get('/status-pacote-base', ProfessorDisciplinaController.listarProfessoresComPacoteBase);

/**
 * @openapi
 * /professor-disciplina/aplicar-base:
 *   post:
 *     tags: [Professor-Disciplina]
 *     summary: Aplicar pacote base a vários professores (ADMIN/SECRETARIO)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               professores_ids:
 *                 type: array
 *                 items: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Pacote base aplicado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.post(
  '/aplicar-base',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  ProfessorDisciplinaController.aplicarPacoteBase
);

/**
 * @openapi
 * /professor-disciplina/professor/{professor_id}:
 *   get:
 *     tags: [Professor-Disciplina]
 *     summary: Listar disciplinas que um professor pode lecionar
 *     parameters:
 *       - { in: path, name: professor_id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Disciplinas
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Disciplina' } }
 *   put:
 *     tags: [Professor-Disciplina]
 *     summary: Definir/atualizar as disciplinas de um professor (ADMIN/SECRETARIO)
 *     parameters:
 *       - { in: path, name: professor_id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disciplinas_ids:
 *                 type: array
 *                 items: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Disciplinas atualizadas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/professor/:professor_id', ProfessorDisciplinaController.listarDisciplinasDoProfessor);

router.put(
  '/professor/:professor_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  ProfessorDisciplinaController.definirDisciplinasDoProfessor
);

export default router;
