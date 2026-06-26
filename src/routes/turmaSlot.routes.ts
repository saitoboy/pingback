import { Router } from 'express';
import { TurmaSlotController } from '../controllers/turmaSlot.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

router.get('/turma/:turmaId', autenticar, TurmaSlotController.listarPorTurma);
router.post('/', autenticar, TurmaSlotController.salvar);
router.delete('/turma/:turmaId', autenticar, TurmaSlotController.deletarPorTurma);

export default router;
