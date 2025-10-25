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

// Listar todos os usuários
export const listarTodos = async (): Promise<any[]> => {
  return await connection(tabela)
    .join('usuario_tipo', 'usuario.tipo_usuario_id', 'usuario_tipo.tipo_usuario_id')
    .select(
      'usuario.*',
      'usuario_tipo.nome_tipo'
    )
    .orderBy('usuario.nome_usuario', 'asc');
};

// Listar usuários por tipo
const listarPorTipo = async (nomeTipo: string): Promise<any[]> => {
  return await connection(tabela)
    .join('usuario_tipo', 'usuario.tipo_usuario_id', 'usuario_tipo.tipo_usuario_id')
    .select(
      'usuario.*',
      'usuario_tipo.nome_tipo'
    )
    .where('usuario_tipo.nome_tipo', nomeTipo)
    .orderBy('usuario.nome_usuario', 'asc');
};

export { listarPorTipo };

// Atualizar usuário
export const atualizar = async (usuario_id: string, dadosAtualizacao: Partial<Omit<Usuario, 'usuario_id' | 'created_at'>>): Promise<Usuario | undefined> => {
  const [usuarioAtualizado] = await connection(tabela)
    .where({ usuario_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return usuarioAtualizado;
};

// Deletar usuário
export const deletar = async (usuario_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ usuario_id })
    .del();
  return linhasAfetadas > 0;
};

// Busca usuário com dados do tipo de usuário (JOIN)
export const buscarComTipoUsuario = async (email_usuario: string) => {
  return await connection(tabela)
    .join('usuario_tipo', 'usuario.tipo_usuario_id', 'usuario_tipo.tipo_usuario_id')
    .select(
      'usuario.*',
      'usuario_tipo.nome_tipo'
    )
    .where('usuario.email_usuario', email_usuario)
    .first();
};

// Busca usuário por ID com dados do tipo de usuário (JOIN)
export const buscarPorIdComTipo = async (usuario_id: string) => {
  return await connection(tabela)
    .join('usuario_tipo', 'usuario.tipo_usuario_id', 'usuario_tipo.tipo_usuario_id')
    .select(
      'usuario.*',
      'usuario_tipo.nome_tipo'
    )
    .where('usuario.usuario_id', usuario_id)
    .first();
};
