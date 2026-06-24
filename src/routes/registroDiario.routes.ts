import { Router } from 'express';
import RegistroDiarioController from '../controllers/registroDiario.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types/models';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(autenticar);

// GET /registro-diario/professor/:professorId - Listar registros de um professor (visão admin/secretaria)
router.get(
  '/professor/:professorId',
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.SECRETARIO]),
  RegistroDiarioController.listarPorProfessor
);

// GET /registro-diario/vinculacao/:vinculacaoId - Listar registros de uma vinculação (timeline)
router.get('/vinculacao/:vinculacaoId', RegistroDiarioController.listarPorVinculacao);

// GET /registro-diario/data/:vinculacaoId/:data - Buscar o registro de um dia específico
router.get('/data/:vinculacaoId/:data', RegistroDiarioController.buscarPorDataEVinculacao);

// POST /registro-diario - Criar ou atualizar o registro do dia (ADMIN e PROFESSOR)
router.post('/', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), RegistroDiarioController.salvar);

// PUT /registro-diario/:id - Atualizar registro por ID (ADMIN e PROFESSOR)
router.put('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), RegistroDiarioController.atualizar);

// DELETE /registro-diario/:id - Deletar registro (ADMIN e PROFESSOR)
router.delete('/:id', autorizarPor([TipoUsuario.ADMIN, TipoUsuario.PROFESSOR]), RegistroDiarioController.deletar);

export default router;
