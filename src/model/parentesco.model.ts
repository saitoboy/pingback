import connection from '../connection';
import { Parentesco } from '../types/models';

const tabela = 'parentesco';

export const buscarPorId = async (parentesco_id: string): Promise<Parentesco | undefined> => {
  return await connection(tabela)
    .where({ parentesco_id })
    .first();
};

export const listarTodos = async (): Promise<Parentesco[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('nome_parentesco', 'asc');
};

export const criar = async (parentesco: Omit<Parentesco, 'parentesco_id' | 'created_at' | 'updated_at'>): Promise<Parentesco> => {
  const [novoParentesco] = await connection(tabela)
    .insert({
      ...parentesco,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novoParentesco;
};

export const atualizar = async (parentesco_id: string, dadosAtualizacao: Partial<Omit<Parentesco, 'parentesco_id' | 'created_at'>>): Promise<Parentesco | undefined> => {
  const [parentescoAtualizado] = await connection(tabela)
    .where({ parentesco_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return parentescoAtualizado;
};

export const deletar = async (parentesco_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ parentesco_id })
    .del();
  return linhasAfetadas > 0;
};

export const buscarPorNome = async (nome_parentesco: string): Promise<Parentesco | undefined> => {
  return await connection(tabela)
    .where('nome_parentesco', 'ilike', `%${nome_parentesco}%`)
    .first();
};
