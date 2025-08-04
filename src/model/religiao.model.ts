import connection from '../connection';
import { Religiao } from '../types/models';

const tabela = 'religiao';

export const buscarPorId = async (religiao_id: string): Promise<Religiao | undefined> => {
  return await connection(tabela)
    .where({ religiao_id })
    .first();
};

export const listarTodos = async (): Promise<Religiao[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('nome_religiao', 'asc');
};

export const criar = async (religiao: Omit<Religiao, 'religiao_id' | 'created_at' | 'updated_at'>): Promise<Religiao> => {
  const [novaReligiao] = await connection(tabela)
    .insert({
      ...religiao,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novaReligiao;
};

export const atualizar = async (religiao_id: string, dadosAtualizacao: Partial<Omit<Religiao, 'religiao_id' | 'created_at'>>): Promise<Religiao | undefined> => {
  const [religiaoAtualizada] = await connection(tabela)
    .where({ religiao_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return religiaoAtualizada;
};

export const deletar = async (religiao_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ religiao_id })
    .del();
  return linhasAfetadas > 0;
};

export const buscarPorNome = async (nome_religiao: string): Promise<Religiao | undefined> => {
  return await connection(tabela)
    .where('nome_religiao', 'ilike', `%${nome_religiao}%`)
    .first();
};
