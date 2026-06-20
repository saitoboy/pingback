import { Router } from 'express';
import ProfessorDisciplinaController from '../controllers/professorDisciplina.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// Aplicar pacote base a vários professores de uma vez (apenas ADMIN e SECRETARIO)
router.post(
  '/aplicar-base',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  ProfessorDisciplinaController.aplicarPacoteBase
);

// Listar disciplinas que um professor pode lecionar (qualquer usuário autenticado)
router.get('/professor/:professor_id', ProfessorDisciplinaController.listarDisciplinasDoProfessor);

// Definir/atualizar as disciplinas de um professor (apenas ADMIN e SECRETARIO)
router.put(
  '/professor/:professor_id',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  ProfessorDisciplinaController.definirDisciplinasDoProfessor
);

export default router;
