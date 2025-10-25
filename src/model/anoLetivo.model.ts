import connection from '../connection';
import { AnoLetivo } from '../types/models';

const tabela = 'ano_letivo';

export const buscarPorId = async (ano_letivo_id: string): Promise<AnoLetivo | undefined> => {
  return await connection(tabela)
    .where({ ano_letivo_id })
    .first();
};

export const buscarPorAno = async (ano: number): Promise<AnoLetivo | undefined> => {
  return await connection(tabela)
    .where({ ano })
    .first();
};

export const buscarAtivo = async (): Promise<AnoLetivo | undefined> => {
  return await connection(tabela)
    .where({ ativo: true })
    .first();
};

export const listarTodos = async (): Promise<AnoLetivo[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('ano', 'desc');
};

export const criar = async (anoLetivo: Omit<AnoLetivo, 'ano_letivo_id' | 'created_at' | 'updated_at'>): Promise<AnoLetivo> => {
  const [novoAnoLetivo] = await connection(tabela)
    .insert({
      ...anoLetivo,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novoAnoLetivo;
};

export const atualizar = async (ano_letivo_id: string, anoLetivoAtualizacao: Partial<Omit<AnoLetivo, 'ano_letivo_id' | 'created_at'>>): Promise<AnoLetivo | undefined> => {
  const [anoLetivoAtualizado] = await connection(tabela)
    .where({ ano_letivo_id })
    .update({
      ...anoLetivoAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return anoLetivoAtualizado;
};

export const deletar = async (ano_letivo_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ ano_letivo_id })
    .del();
  return linhasAfetadas > 0;
};
