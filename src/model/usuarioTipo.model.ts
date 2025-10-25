import connection from '../connection';
import { UsuarioTipo, TipoUsuario } from '../types/models';

const tabela = 'usuario_tipo';

export const listarTodos = async (): Promise<UsuarioTipo[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('nome_tipo', 'asc');
};

export const buscarPorId = async (tipo_usuario_id: string): Promise<UsuarioTipo | undefined> => {
  return await connection(tabela)
    .where({ tipo_usuario_id })
    .first();
};

export const buscarPorNome = async (nome_tipo: string): Promise<UsuarioTipo | undefined> => {
  return await connection(tabela)
    .where({ nome_tipo })
    .first();
};

export const criar = async (dados: Omit<UsuarioTipo, 'tipo_usuario_id' | 'created_at' | 'updated_at'>): Promise<UsuarioTipo | undefined> => {
  const [novoTipo] = await connection(tabela)
    .insert({
      ...dados,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novoTipo;
};

export const atualizar = async (tipo_usuario_id: string, dadosAtualizacao: Partial<Omit<UsuarioTipo, 'tipo_usuario_id' | 'created_at'>>): Promise<UsuarioTipo | undefined> => {
  const [tipoAtualizado] = await connection(tabela)
    .where({ tipo_usuario_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return tipoAtualizado;
};

export const deletar = async (tipo_usuario_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ tipo_usuario_id })
    .del();
  return linhasAfetadas > 0;
};
