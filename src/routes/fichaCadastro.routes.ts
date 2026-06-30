import { Router } from 'express';
import FichaCadastroController from '../controllers/fichaCadastro.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

/**
 * @openapi
 * /ficha-cadastro:
 *   get:
 *     tags: [Ficha Cadastro]
 *     summary: Listar todas as fichas de cadastro
 *     responses:
 *       200:
 *         description: Lista
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       401: { $ref: '#/components/responses/NaoAutorizado' }
 *   post:
 *     tags: [Ficha Cadastro]
 *     summary: Processar ficha de cadastro completa (ADMIN/SECRETARIO)
 *     description: >
 *       Cria em uma única operação o aluno, certidão, responsáveis, dados de saúde,
 *       diagnóstico e matrícula. Retorna a ficha completa com o RA gerado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aluno: { $ref: '#/components/schemas/AlunoInput' }
 *               certidao: { $ref: '#/components/schemas/CertidaoInput' }
 *               responsaveis: { type: array, items: { $ref: '#/components/schemas/ResponsavelInput' } }
 *               dados_saude: { $ref: '#/components/schemas/DadosSaude' }
 *               diagnostico: { $ref: '#/components/schemas/Diagnostico' }
 *               matricula: { $ref: '#/components/schemas/MatriculaAlunoInput' }
 *     responses:
 *       201:
 *         description: Ficha processada com RA gerado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.get('/', FichaCadastroController.listarTodasFichas);

/**
 * @openapi
 * /ficha-cadastro/modelo:
 *   get:
 *     tags: [Ficha Cadastro]
 *     summary: Obter modelo/template da ficha
 *     responses:
 *       200:
 *         description: Modelo
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 */
router.get('/modelo', FichaCadastroController.obterModeloFicha);

/**
 * @openapi
 * /ficha-cadastro/ra/{ra}:
 *   get:
 *     tags: [Ficha Cadastro]
 *     summary: Buscar ficha completa por RA
 *     parameters:
 *       - { in: path, name: ra, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Ficha completa
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       404: { $ref: '#/components/responses/NaoEncontrado' }
 */
router.get('/ra/:ra', FichaCadastroController.buscarFichaPorRA);

router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), FichaCadastroController.processarFichaCadastro);

/**
 * @openapi
 * /ficha-cadastro/lote:
 *   post:
 *     tags: [Ficha Cadastro]
 *     summary: Processar várias fichas de cadastro em lote (ADMIN)
 *     description: >
 *       Recebe { fichas: FichaCadastroCompleta[] } e processa cada ficha em sua própria
 *       transação (sucesso parcial). Retorna 201 (todas), 207 (parcial) ou 400 (nenhuma).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fichas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     aluno: { $ref: '#/components/schemas/AlunoInput' }
 *                     certidao: { $ref: '#/components/schemas/CertidaoInput' }
 *                     responsaveis: { type: array, items: { $ref: '#/components/schemas/ResponsavelInput' } }
 *                     dados_saude: { $ref: '#/components/schemas/DadosSaude' }
 *                     diagnostico: { $ref: '#/components/schemas/Diagnostico' }
 *                     matricula: { $ref: '#/components/schemas/MatriculaAlunoInput' }
 *     responses:
 *       201:
 *         description: Todas as fichas processadas
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sucesso' }
 *       207:
 *         description: Sucesso parcial
 *       400:
 *         description: Nenhuma ficha criada
 *       403: { $ref: '#/components/responses/ProibidoPermissao' }
 */
router.post('/lote', autorizarPor([TipoUsuario.ADMIN]), FichaCadastroController.processarFichasCadastroLote);

export default router;
