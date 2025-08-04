import connection from '../connection';
import { CertidaoNascimento } from '../types/models';

const tabela = 'certidao_nascimento';

export const buscarPorId = async (certidao_id: string): Promise<CertidaoNascimento | undefined> => {
  return await connection(tabela)
    .where({ certidao_id })
    .first();
};

export const listarTodos = async (): Promise<CertidaoNascimento[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');
};

export const criar = async (certidao: Omit<CertidaoNascimento, 'certidao_id' | 'created_at' | 'updated_at'>): Promise<CertidaoNascimento> => {
  const [novaCertidao] = await connection(tabela)
    .insert({
      ...certidao,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novaCertidao;
};

export const atualizar = async (certidao_id: string, dadosAtualizacao: Partial<Omit<CertidaoNascimento, 'certidao_id' | 'created_at'>>): Promise<CertidaoNascimento | undefined> => {
  const [certidaoAtualizada] = await connection(tabela)
    .where({ certidao_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return certidaoAtualizada;
};

export const deletar = async (certidao_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ certidao_id })
    .del();
  return linhasAfetadas > 0;
};

export const buscarPorMatricula = async (matricula_certidao: string): Promise<CertidaoNascimento | undefined> => {
  return await connection(tabela)
    .where({ matricula_certidao })
    .first();
};

export const buscarPorCartorio = async (nome_cartorio: string): Promise<CertidaoNascimento[]> => {
  return await connection(tabela)
    .where('nome_cartorio_certidao', 'ilike', `%${nome_cartorio}%`)
    .orderBy('created_at', 'desc');
};
