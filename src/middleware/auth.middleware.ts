import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TipoUsuario } from '../types/models';

// Estende o tipo Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      usuario?: {
        usuario_id: string;
        nome_usuario: string;
        email_usuario: string;
        tipo_usuario_id: TipoUsuario;
      };
    }
  }
}

// Função para verificar e decodificar o token JWT
export const verificarToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

// Middleware para autenticação
export const autenticar = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ mensagem: 'Token não fornecido' });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ mensagem: 'Token não fornecido' });
      return;
    }
    const usuarioDecodificado = verificarToken(token) as any;
    req.usuario = {
      usuario_id: usuarioDecodificado.usuario_id,
      nome_usuario: usuarioDecodificado.nome_usuario,
      email_usuario: usuarioDecodificado.email_usuario || '', // pode não estar no token
      tipo_usuario_id: usuarioDecodificado.tipo_usuario_id,
    };
    next();
  } catch (error) {
    res.status(401).json({ mensagem: 'Token inválido ou expirado' });
    return;
  }
};

// Função utilitária para checar permissão
export const temPermissao = (tipo: TipoUsuario, permitidos: TipoUsuario[]): boolean => {
  return permitidos.includes(tipo);
};

// Middleware para autorização por tipo de usuário
export const autorizarPor = (tiposPermitidos: TipoUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ mensagem: 'Usuário não autenticado' });
      return;
    }
    if (!temPermissao(req.usuario.tipo_usuario_id, tiposPermitidos)) {
      res.status(403).json({ mensagem: 'Acesso negado. Permissão insuficiente.' });
      return;
    }
    next();
  };
};
