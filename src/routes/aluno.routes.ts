import { Router } from 'express';
import { AlunoController } from '../controllers/aluno.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();
const alunoController = new AlunoController();

// 🔒 Todas as rotas de aluno requerem autenticação
router.use(autenticar);

/**
 * @route POST /api/alunos
 * @desc Criar novo aluno
 * @access Privado (apenas coordenadores e administradores)
 */
router.post('/', (req, res) => alunoController.criarAluno(req, res));

/**
 * @route GET /api/alunos
 * @desc Listar todos os alunos
 * @access Privado (professores, coordenadores e administradores)
 */
router.get('/', (req, res) => alunoController.listarAlunos(req, res));

/**
 * @route GET /api/alunos/:id
 * @desc Buscar aluno por ID
 * @access Privado (professores, coordenadores e administradores)
 */
router.get('/:id', (req, res) => alunoController.buscarAlunoPorId(req, res));

/**
 * @route GET /api/alunos/cpf/:cpf
 * @desc Buscar aluno por CPF
 * @access Privado (coordenadores e administradores)
 */
router.get('/cpf/:cpf', (req, res) => alunoController.buscarAlunoPorCpf(req, res));

/**
 * @route GET /api/alunos/matricula/:numeroMatricula
 * @desc Buscar aluno por número de matrícula
 * @access Privado (professores, coordenadores e administradores)
 */
router.get('/matricula/:numeroMatricula', (req, res) => alunoController.buscarAlunoPorMatricula(req, res));

/**
 * @route PUT /api/alunos/:id
 * @desc Atualizar dados do aluno
 * @access Privado (coordenadores e administradores)
 */
router.put('/:id', (req, res) => alunoController.atualizarAluno(req, res));

/**
 * @route DELETE /api/alunos/:id
 * @desc Remover aluno (soft delete)
 * @access Privado (apenas administradores)
 */
router.delete('/:id', (req, res) => alunoController.removerAluno(req, res));

/**
 * @route GET /api/alunos/buscar/nome
 * @desc Buscar alunos por nome (busca parcial)
 * @access Privado (professores, coordenadores e administradores)
 */
router.get('/buscar/nome', (req, res) => alunoController.buscarAlunosPorNome(req, res));

/**
 * @route GET /api/alunos/estatisticas/geral
 * @desc Obter estatísticas gerais dos alunos
 * @access Privado (coordenadores e administradores)
 */
router.get('/estatisticas/geral', (req, res) => alunoController.obterEstatisticas(req, res));

export default router;
