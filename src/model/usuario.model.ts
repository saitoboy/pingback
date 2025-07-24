import connection from '../connection';
import { Usuario } from '../types/models';

const tabela = 'usuario';

export const buscarPorEmail = async (email_usuario: string): Promise<Usuario | undefined> => {
  return await connection(tabela)
    .where({ email_usuario })
    .first();
};

export const buscarPorId = async (usuario_id: string): Promise<Usuario | undefined> => {
  return await connection(tabela)
    .where({ usuario_id })
    .first();
};

export const criar = async (usuario: Omit<Usuario, 'usuario_id' | 'created_at' | 'updated_at'>): Promise<Usuario> => {
  const [novoUsuario] = await connection('usuario')
    .insert({
      ...usuario,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novoUsuario;
};

// Outros métodos podem ser adicionados conforme necessidade
