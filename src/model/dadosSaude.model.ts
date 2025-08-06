import connection from '../connection';
import { DadosSaude } from '../types/models';

const tabela = 'dados_saude';

export const buscarPorId = async (dados_saude_id: string): Promise<DadosSaude | undefined> => {
  return await connection(tabela)
    .where({ dados_saude_id })
    .first();
};

export const buscarPorAlunoId = async (aluno_id: string): Promise<DadosSaude | undefined> => {
  return await connection(tabela)
    .where({ aluno_id })
    .first();
};

export const listarTodos = async (): Promise<DadosSaude[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');
};

export const listarComDependencias = async (): Promise<any[]> => {
  return await connection(tabela)
    .select(
      'dados_saude.*',
      'aluno.nome_aluno',
      'aluno.sobrenome_aluno',
      'aluno.numero_matricula_aluno'
    )
    .leftJoin('aluno', 'dados_saude.aluno_id', 'aluno.aluno_id')
    .orderBy('dados_saude.created_at', 'desc');
};

export const buscarComDependencias = async (dados_saude_id: string): Promise<any | undefined> => {
  return await connection(tabela)
    .select(
      'dados_saude.*',
      'aluno.nome_aluno',
      'aluno.sobrenome_aluno',
      'aluno.numero_matricula_aluno',
      'aluno.data_nascimento_aluno'
    )
    .leftJoin('aluno', 'dados_saude.aluno_id', 'aluno.aluno_id')
    .where('dados_saude.dados_saude_id', dados_saude_id)
    .first();
};

export const buscarPorAlunoComDependencias = async (aluno_id: string): Promise<any | undefined> => {
  return await connection(tabela)
    .select(
      'dados_saude.*',
      'aluno.nome_aluno',
      'aluno.sobrenome_aluno',
      'aluno.numero_matricula_aluno',
      'aluno.data_nascimento_aluno'
    )
    .leftJoin('aluno', 'dados_saude.aluno_id', 'aluno.aluno_id')
    .where('dados_saude.aluno_id', aluno_id)
    .first();
};

export const criar = async (dadosSaude: Omit<DadosSaude, 'dados_saude_id' | 'created_at' | 'updated_at'>): Promise<DadosSaude> => {
  const [novosDadosSaude] = await connection(tabela)
    .insert({
      ...dadosSaude,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');
  return novosDadosSaude;
};

export const atualizar = async (dados_saude_id: string, dadosAtualizacao: Partial<Omit<DadosSaude, 'dados_saude_id' | 'created_at'>>): Promise<DadosSaude | undefined> => {
  const [dadosSaudeAtualizado] = await connection(tabela)
    .where({ dados_saude_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date(),
    })
    .returning('*');
  return dadosSaudeAtualizado;
};

export const deletar = async (dados_saude_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ dados_saude_id })
    .del();
  return linhasAfetadas > 0;
};
