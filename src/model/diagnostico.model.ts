import connection from '../connection';
import { Diagnostico } from '../types/models';

const tabela = 'diagnostico';

export const buscarPorId = async (diagnostico_id: string): Promise<Diagnostico | undefined> => {
  return await connection(tabela)
    .where({ diagnostico_id })
    .first();
};

export const buscarPorAlunoId = async (aluno_id: string): Promise<Diagnostico | undefined> => {
  return await connection(tabela)
    .where({ aluno_id })
    .first();
};

export const listarTodos = async (): Promise<Diagnostico[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');
};

export const listarComDependencias = async (): Promise<any[]> => {
  // TEMPORÁRIO: Removendo JOIN até tabela aluno estar pronta
  return await connection(tabela)
    .select('diagnostico.*')
    .orderBy('diagnostico.created_at', 'desc');
};

export const buscarComDependencias = async (diagnostico_id: string): Promise<any | undefined> => {
  // TEMPORÁRIO: Removendo JOIN até tabela aluno estar pronta
  return await connection(tabela)
    .select('diagnostico.*')
    .where('diagnostico.diagnostico_id', diagnostico_id)
    .first();
};

export const buscarPorAlunoComDependencias = async (aluno_id: string): Promise<any | undefined> => {
  // TEMPORÁRIO: Removendo JOIN até tabela aluno estar pronta
  return await connection(tabela)
    .select('diagnostico.*')
    .where('diagnostico.aluno_id', aluno_id)
    .first();
};

export const criar = async (diagnostico: Omit<Diagnostico, 'diagnostico_id' | 'created_at' | 'updated_at'>): Promise<Diagnostico> => {
  const [novoDiagnostico] = await connection(tabela)
    .insert({
      ...diagnostico,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novoDiagnostico;
};

export const atualizar = async (diagnostico_id: string, diagnosticoAtualizacao: Partial<Omit<Diagnostico, 'diagnostico_id' | 'created_at'>>): Promise<Diagnostico | undefined> => {
  const [diagnosticoAtualizado] = await connection(tabela)
    .where({ diagnostico_id })
    .update({
      ...diagnosticoAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return diagnosticoAtualizado;
};

export const deletar = async (diagnostico_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ diagnostico_id })
    .del();
  return linhasAfetadas > 0;
};
