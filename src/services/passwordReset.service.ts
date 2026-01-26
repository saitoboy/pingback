import bcrypt from 'bcryptjs';
import connection from '../connection';
import * as UsuarioModel from '../model/usuario.model';
import EmailService from './email.service';
import { logError, logSuccess } from '../utils/logger';

export class PasswordResetService {
  /**
   * Gera um código de 6 dígitos aleatório
   */
  private static gerarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Solicita redefinição de senha - envia código por email
   */
  static async solicitarRedefinicao(email: string): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      // Busca usuário pelo email
      const usuario = await UsuarioModel.buscarPorEmail(email);
      
      if (!usuario) {
        // Por segurança, não revela se o email existe ou não
        logError('Tentativa de redefinição para email não cadastrado', 'password-reset', { email });
        return {
          sucesso: true, // Retorna sucesso mesmo se não encontrar (segurança)
          mensagem: 'Se o email estiver cadastrado, você receberá um código de redefinição.'
        };
      }

      // Gera código de 6 dígitos
      const codigo = this.gerarCodigo();
      
      // Define expiração (15 minutos)
      const expiraEm = new Date();
      expiraEm.setMinutes(expiraEm.getMinutes() + 15);

      // Invalida códigos anteriores não usados do mesmo usuário
      await connection('password_reset_codes')
        .where({ usuario_id: usuario.usuario_id, usado: false })
        .update({ usado: true });

      // Salva o novo código no banco
      await connection('password_reset_codes').insert({
        usuario_id: usuario.usuario_id,
        codigo,
        email_usuario: email,
        expira_em: expiraEm,
        usado: false
      });

      // Envia email com o código
      await EmailService.enviarCodigoRedefinicaoSenha({
        email,
        nome: usuario.nome_usuario,
        codigo
      });

      logSuccess('Código de redefinição gerado e enviado', 'password-reset', { 
        usuario_id: usuario.usuario_id,
        email 
      });

      return {
        sucesso: true,
        mensagem: 'Se o email estiver cadastrado, você receberá um código de redefinição.'
      };
    } catch (error: any) {
      logError('Erro ao solicitar redefinição de senha', 'password-reset', error);
      throw error;
    }
  }

  /**
   * Verifica se o código é válido
   */
  static async verificarCodigo(email: string, codigo: string): Promise<{ 
    valido: boolean; 
    mensagem: string;
    reset_code_id?: string;
  }> {
    try {
      // Busca código não usado e não expirado
      const codigoReset = await connection('password_reset_codes')
        .where({ 
          email_usuario: email,
          codigo,
          usado: false
        })
        .where('expira_em', '>', new Date())
        .first();

      if (!codigoReset) {
        logError('Código inválido ou expirado', 'password-reset', { email, codigo });
        return {
          valido: false,
          mensagem: 'Código inválido ou expirado. Solicite um novo código.'
        };
      }

      logSuccess('Código verificado com sucesso', 'password-reset', { 
        reset_code_id: codigoReset.reset_code_id 
      });

      return {
        valido: true,
        mensagem: 'Código válido.',
        reset_code_id: codigoReset.reset_code_id
      };
    } catch (error: any) {
      logError('Erro ao verificar código', 'password-reset', error);
      throw error;
    }
  }

  /**
   * Redefine a senha do usuário
   */
  static async redefinirSenha(
    reset_code_id: string, 
    nova_senha: string
  ): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      // Busca o código de reset
      const codigoReset = await connection('password_reset_codes')
        .where({ 
          reset_code_id,
          usado: false
        })
        .where('expira_em', '>', new Date())
        .first();

      if (!codigoReset) {
        logError('Código de reset inválido ou expirado', 'password-reset', { reset_code_id });
        return {
          sucesso: false,
          mensagem: 'Código inválido ou expirado. Solicite um novo código.'
        };
      }

      // Validação básica de senha
      if (!nova_senha || nova_senha.length < 6) {
        return {
          sucesso: false,
          mensagem: 'A senha deve ter pelo menos 6 caracteres.'
        };
      }

      // Criptografa a nova senha
      const hashSenha = await bcrypt.hash(nova_senha, 10);

      // Atualiza a senha do usuário
      await UsuarioModel.atualizar(codigoReset.usuario_id, {
        senha_usuario: hashSenha
      });

      // Marca o código como usado
      await connection('password_reset_codes')
        .where({ reset_code_id })
        .update({ usado: true });

      // Invalida outros códigos não usados do mesmo usuário
      await connection('password_reset_codes')
        .where({ 
          usuario_id: codigoReset.usuario_id,
          usado: false
        })
        .update({ usado: true });

      logSuccess('Senha redefinida com sucesso', 'password-reset', { 
        usuario_id: codigoReset.usuario_id 
      });

      return {
        sucesso: true,
        mensagem: 'Senha redefinida com sucesso!'
      };
    } catch (error: any) {
      logError('Erro ao redefinir senha', 'password-reset', error);
      throw error;
    }
  }
}

export default PasswordResetService;
