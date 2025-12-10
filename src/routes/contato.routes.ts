import { Router } from 'express';
import ContatoController from '../controllers/contato.controller';

const router = Router();

// Rota pública para envio de mensagem de contato (não precisa de autenticação)
router.post('/', ContatoController.enviarMensagem);

export default router;

