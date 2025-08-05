import connection from '../connection';
import { Responsavel } from '../types/models';

const tabela = 'responsavel';

export const buscarPorId = async (responsavel_id: string): Promise<Responsavel | undefined> => {
  return await connection(tabela)
    .where({ responsavel_id })
    .first();
};

export const buscarPorCpf = async (cpf_responsavel: string): Promise<Responsavel | undefined> => {
  return await connection(tabela)
    .where({ cpf_responsavel })
    .first();
};

export const listarTodos = async (): Promise<Responsavel[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('nome_responsavel', 'asc');
};

export const listarPorAluno = async (aluno_id: string): Promise<Responsavel[]> => {
  return await connection(tabela)
    .where({ aluno_id })
    .orderBy('nome_responsavel', 'asc');
};

export const criar = async (responsavel: Omit<Responsavel, 'responsavel_id' | 'created_at' | 'updated_at'>): Promise<Responsavel> => {
  const [novoResponsavel] = await connection(tabela)
    .insert({
      ...responsavel,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novoResponsavel;
};

export const atualizar = async (responsavel_id: string, dadosAtualizacao: Partial<Omit<Responsavel, 'responsavel_id' | 'created_at'>>): Promise<Responsavel | undefined> => {
  const [responsavelAtualizado] = await connection(tabela)
    .where({ responsavel_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return responsavelAtualizado;
};

export const deletar = async (responsavel_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ responsavel_id })
    .del();
  return linhasAfetadas > 0;
};

// Busca responsável com dados do parentesco e aluno (JOIN)
export const buscarComDependencias = async (responsavel_id: string) => {
  return await connection(tabela)
    .leftJoin('parentesco', 'responsavel.parentesco_id', 'parentesco.parentesco_id')
    .leftJoin('aluno', 'responsavel.aluno_id', 'aluno.aluno_id')
    .select(
      'responsavel.*',
      'parentesco.nome_parentesco',
      'aluno.nome_aluno',
      'aluno.sobrenome_aluno'
    )
    .where('responsavel.responsavel_id', responsavel_id)
    .first();
};

// Lista todos os responsáveis com dados do parentesco e aluno
export const listarComDependencias = async () => {
  return await connection(tabela)
    .leftJoin('parentesco', 'responsavel.parentesco_id', 'parentesco.parentesco_id')
    .leftJoin('aluno', 'responsavel.aluno_id', 'aluno.aluno_id')
    .select(
      'responsavel.*',
      'parentesco.nome_parentesco',
      'aluno.nome_aluno',
      'aluno.sobrenome_aluno'
    )
    .orderBy('responsavel.nome_responsavel', 'asc');
};

// Lista responsáveis de um aluno específico com dados do parentesco
export const listarPorAlunoComDependencias = async (aluno_id: string) => {
  return await connection(tabela)
    .leftJoin('parentesco', 'responsavel.parentesco_id', 'parentesco.parentesco_id')
    .select(
      'responsavel.*',
      'parentesco.nome_parentesco'
    )
    .where('responsavel.aluno_id', aluno_id)
    .orderBy('responsavel.nome_responsavel', 'asc');
};
