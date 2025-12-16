import { Request, Response } from 'express';
import EmailService from '../services/email.service';
import { logError, logSuccess } from '../utils/logger';

export class ContatoController {
  static async enviarMensagem(req: Request, res: Response) {
    try {
      const camposEsperados = ['nome', 'telefone', 'email', 'mensagem'];
      const camposFaltando = camposEsperados.filter(campo => !(campo in req.body));
      
      if (camposFaltando.length > 0) {
        logError(`Erro no contato: campos ausentes: ${camposFaltando.join(', ')}`, 'controller', req.body);
        return res.status(400).json({ 
          mensagem: `Campos obrigatórios ausentes: ${camposFaltando.join(', ')}` 
        });
      }

      const { nome, telefone, email, mensagem } = req.body;

      // Validação de campos vazios
      if (!nome || !telefone || !email || !mensagem) {
        const camposVazios = [];
        if (!nome) camposVazios.push('nome');
        if (!telefone) camposVazios.push('telefone');
        if (!email) camposVazios.push('email');
        if (!mensagem) camposVazios.push('mensagem');
        
        logError(`Erro no contato: campos sem valor: ${camposVazios.join(', ')}`, 'controller', req.body);
        return res.status(400).json({ 
          mensagem: `Campos obrigatórios sem valor: ${camposVazios.join(', ')}` 
        });
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        logError('Email inválido fornecido', 'controller', { email });
        return res.status(400).json({ 
          mensagem: 'E-mail inválido.' 
        });
      }

      // Envia o email
      await EmailService.enviarEmailContato({
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
        mensagem: mensagem.trim(),
      });

      logSuccess(`Mensagem de contato enviada: ${nome} (${email})`, 'controller', { 
        nome,
        email 
      });

      return res.status(200).json({ 
        mensagem: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        status: 'sucesso'
      });

    } catch (error: any) {
      logError('Erro inesperado ao enviar mensagem de contato', 'controller', error);
      
      // Se for erro de configuração de email, retorna mensagem específica
      if (error.code === 'EAUTH' || error.message?.includes('authentication')) {
        return res.status(500).json({ 
          mensagem: 'Erro na configuração do servidor de email. Por favor, entre em contato pelo telefone.',
          detalhes: 'Erro de autenticação no servidor de email'
        });
      }

      return res.status(500).json({ 
        mensagem: 'Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato pelo telefone.',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default ContatoController;

