import connection from '../connection';

export interface TurmaBreak {
  break_id: string;
  turma_id: string;
  dia_semana: number | null; // NULL = todos os dias
  tipo: 'lanche' | 'recreio';
  hora_inicio: string;
  hora_fim: string;
  created_at?: Date;
  updated_at?: Date;
}

const tabela = 'turma_break';

export const listarPorTurma = async (turma_id: string): Promise<TurmaBreak[]> => {
  return await connection(tabela)
    .where({ turma_id })
    .orderBy('hora_inicio', 'asc');
};

export const buscarPorId = async (break_id: string): Promise<TurmaBreak | undefined> => {
  return await connection(tabela).where({ break_id }).first();
};

export const criar = async (
  dados: Omit<TurmaBreak, 'break_id' | 'created_at' | 'updated_at'>
): Promise<TurmaBreak> => {
  const [novo] = await connection(tabela)
    .insert({ ...dados, created_at: new Date(), updated_at: new Date() })
    .returning('*');
  return novo;
};

export const atualizar = async (
  break_id: string,
  dados: Partial<Omit<TurmaBreak, 'break_id' | 'turma_id' | 'created_at' | 'updated_at'>>
): Promise<TurmaBreak | undefined> => {
  const [atualizado] = await connection(tabela)
    .where({ break_id })
    .update({ ...dados, updated_at: new Date() })
    .returning('*');
  return atualizado;
};

export const deletar = async (break_id: string): Promise<boolean> => {
  const linhas = await connection(tabela).where({ break_id }).del();
  return linhas > 0;
};
