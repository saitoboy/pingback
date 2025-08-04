import { Router } from 'express';
import { CertidaoController } from '../controllers/certidao.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();
const certidaoController = new CertidaoController();

// 🔒 Todas as rotas de certidão requerem autenticação
router.use(autenticar);

/**
 * @route POST /api/certidao
 * @desc Criar nova certidão de nascimento
 * @access Privado (coordenadores e administradores)
 */
router.post('/', (req, res) => certidaoController.criarCertidao(req, res));

/**
 * @route GET /api/certidao
 * @desc Listar todas as certidões
 * @access Privado (todos os usuários autenticados)
 */
router.get('/', (req, res) => certidaoController.listarCertidoes(req, res));

/**
 * @route GET /api/certidao/:id
 * @desc Buscar certidão por ID
 * @access Privado (todos os usuários autenticados)
 */
router.get('/:id', (req, res) => certidaoController.buscarCertidaoPorId(req, res));

/**
 * @route GET /api/certidao/matricula/:matricula
 * @desc Buscar certidão por matrícula
 * @access Privado (todos os usuários autenticados)
 */
router.get('/matricula/:matricula', (req, res) => certidaoController.buscarCertidaoPorMatricula(req, res));

/**
 * @route PUT /api/certidao/:id
 * @desc Atualizar dados da certidão
 * @access Privado (coordenadores e administradores)
 */
router.put('/:id', (req, res) => certidaoController.atualizarCertidao(req, res));

/**
 * @route DELETE /api/certidao/:id
 * @desc Remover certidão
 * @access Privado (apenas administradores)
 */
router.delete('/:id', (req, res) => certidaoController.removerCertidao(req, res));

export default router;
