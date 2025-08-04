import { Router } from 'express';
import { ReligiaoController } from '../controllers/religiao.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();
const religiaoController = new ReligiaoController();

// 🔒 Todas as rotas de religião requerem autenticação
router.use(autenticar);

/**
 * @route POST /api/religiao
 * @desc Criar nova religião
 * @access Privado (coordenadores e administradores)
 */
router.post('/', (req, res) => religiaoController.criarReligiao(req, res));

/**
 * @route GET /api/religiao
 * @desc Listar todas as religiões
 * @access Privado (todos os usuários autenticados)
 */
router.get('/', (req, res) => religiaoController.listarReligioes(req, res));

/**
 * @route GET /api/religiao/:id
 * @desc Buscar religião por ID
 * @access Privado (todos os usuários autenticados)
 */
router.get('/:id', (req, res) => religiaoController.buscarReligiaoPorId(req, res));

/**
 * @route PUT /api/religiao/:id
 * @desc Atualizar dados da religião
 * @access Privado (coordenadores e administradores)
 */
router.put('/:id', (req, res) => religiaoController.atualizarReligiao(req, res));

/**
 * @route DELETE /api/religiao/:id
 * @desc Remover religião
 * @access Privado (apenas administradores)
 */
router.delete('/:id', (req, res) => religiaoController.removerReligiao(req, res));

export default router;
