import { Router } from 'express';
import { TurmaBreakController } from '../controllers/turmaBreak.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

router.get('/turma/:turmaId', autenticar, TurmaBreakController.listarPorTurma);
router.post('/', autenticar, TurmaBreakController.criar);
router.put('/:id', autenticar, TurmaBreakController.atualizar);
router.delete('/:id', autenticar, TurmaBreakController.deletar);

export default router;
