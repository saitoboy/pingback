import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UsuarioModel from '../model/usuario.model';
import { Usuario, TipoUsuario } from '../types/models';
import logger, { logError, logSuccess } from '../utils/logger';

export class AuthService {
  static async loginUsuario(email: string, senha: string): Promise<{ token: string; usuario: Usuario } | null> {
    try {
      // Busca usuário pelo email usando o model
      const usuario: Usuario | undefined = await UsuarioModel.buscarPorEmail(email);
      if (!usuario) {
        logError('Usuário não encontrado', 'service', { email });
        return null;
      }

      // Valida senha com bcrypt
      const senhaValida = await bcrypt.compare(senha, usuario.senha_usuario);
      if (!senhaValida) {
        logError('Senha inválida', 'service', { email });
        return null;
      }

      // Gera JWT
      const token = jwt.sign(
        {
          usuario_id: usuario.usuario_id,
          tipo_usuario_id: usuario.tipo_usuario_id,
          nome_usuario: usuario.nome_usuario,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '8h' }
      );

      logSuccess('Login realizado com sucesso', 'service', { usuario_id: usuario.usuario_id });
      return { token, usuario };
    } catch (error) {
      logError('Erro no login', 'service', error);
      throw error;
    }
  }

  static async registrarUsuario(
    nome_usuario: string,
    email_usuario: string,
    senha: string, // alterado para 'senha'
    tipo_usuario_id: TipoUsuario
  ): Promise<Omit<Usuario, 'senha_usuario'> | null> {
    try {
      // Verifica se email já existe
      const usuarioExistente = await UsuarioModel.buscarPorEmail(email_usuario);
      if (usuarioExistente) {
        logError('Email já cadastrado', 'service', { email_usuario });
        return null;
      }
      // Criptografa a senha
      const hashSenha = await bcrypt.hash(senha, 10);
      // Cria usuário
      const novoUsuario = await UsuarioModel.criar({
        nome_usuario,
        email_usuario,
        senha_usuario: hashSenha,
        tipo_usuario_id,
      });
      logSuccess('Usuário cadastrado com sucesso', 'service', { usuario_id: novoUsuario.usuario_id });
      // Remove campo senha antes de retornar
      const { senha_usuario, ...usuarioSemSenha } = novoUsuario;
      return usuarioSemSenha;
    } catch (error) {
      logError('Erro ao registrar usuário', 'service', error);
      throw error;
    }
  }
}

export default AuthService;
