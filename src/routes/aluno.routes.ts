import { Router } from 'express';
import { AlunoController } from '../controllers/aluno.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Rotas básicas de consulta (todos os usuários autenticados)
router.get('/', AlunoController.listarAlunos);
router.get('/:id', AlunoController.buscarAlunoPorId);
router.get('/cpf/:cpf', AlunoController.buscarAlunoPorCpf);
router.get('/matricula/:numeroMatricula', AlunoController.buscarAlunoPorMatricula);
router.get('/buscar/nome', AlunoController.buscarAlunosPorNome);
router.get('/estatisticas/geral', AlunoController.obterEstatisticas);

// Rotas que precisam de permissão de ADMIN E SECRETARIO
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AlunoController.criarAluno);
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AlunoController.atualizarAluno);
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]), AlunoController.removerAluno);

export default router;
