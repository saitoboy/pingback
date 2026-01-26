import { Request, Response } from 'express';
import PasswordResetService from '../services/passwordReset.service';
import { logError, logSuccess } from '../utils/logger';

export class PasswordResetController {
  /**
   * POST /auth/forgot-password
   * Solicita redefinição de senha - envia código por email
   */
  static async solicitarRedefinicao(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email é obrigatório.'
        });
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email inválido.'
        });
      }

      const resultado = await PasswordResetService.solicitarRedefinicao(email.trim());

      logSuccess('Solicitação de redefinição processada', 'controller', { email });

      return res.status(200).json(resultado);
    } catch (error: any) {
      logError('Erro ao processar solicitação de redefinição', 'controller', error);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor. Tente novamente mais tarde.'
      });
    }
  }

  /**
   * POST /auth/verify-reset-code
   * Verifica se o código de redefinição é válido
   */
  static async verificarCodigo(req: Request, res: Response) {
    try {
      const { email, codigo } = req.body;

      if (!email || !codigo) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email e código são obrigatórios.'
        });
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email inválido.'
        });
      }

      // Validação do código (deve ter 6 dígitos)
      if (!/^\d{6}$/.test(codigo)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Código deve conter 6 dígitos.'
        });
      }

      const resultado = await PasswordResetService.verificarCodigo(email.trim(), codigo.trim());

      if (!resultado.valido) {
        return res.status(400).json({
          sucesso: false,
          mensagem: resultado.mensagem
        });
      }

      logSuccess('Código verificado com sucesso', 'controller', { email });

      return res.status(200).json({
        sucesso: true,
        mensagem: resultado.mensagem,
        reset_code_id: resultado.reset_code_id
      });
    } catch (error: any) {
      logError('Erro ao verificar código', 'controller', error);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor. Tente novamente mais tarde.'
      });
    }
  }

  /**
   * POST /auth/reset-password
   * Redefine a senha do usuário
   */
  static async redefinirSenha(req: Request, res: Response) {
    try {
      const { reset_code_id, nova_senha } = req.body;

      if (!reset_code_id || !nova_senha) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Código de reset e nova senha são obrigatórios.'
        });
      }

      // Validação básica de senha
      if (nova_senha.length < 6) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'A senha deve ter pelo menos 6 caracteres.'
        });
      }

      const resultado = await PasswordResetService.redefinirSenha(
        reset_code_id,
        nova_senha
      );

      if (!resultado.sucesso) {
        return res.status(400).json(resultado);
      }

      logSuccess('Senha redefinida com sucesso', 'controller', { reset_code_id });

      return res.status(200).json(resultado);
    } catch (error: any) {
      logError('Erro ao redefinir senha', 'controller', error);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor. Tente novamente mais tarde.'
      });
    }
  }
}

export default PasswordResetController;
