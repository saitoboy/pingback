import connection from '../connection';
import { Disciplina } from '../types/models';

const tabela = 'disciplina';

export const listarTodas = async (): Promise<Disciplina[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('nome_disciplina', 'asc');
};

export const buscarPorId = async (disciplina_id: string): Promise<Disciplina | undefined> => {
  return await connection(tabela)
    .where({ disciplina_id })
    .first();
};

export const buscarPorNome = async (nome_disciplina: string): Promise<Disciplina | undefined> => {
  return await connection(tabela)
    .whereILike('nome_disciplina', `%${nome_disciplina}%`)
    .first();
};

export const criar = async (disciplina: Omit<Disciplina, 'disciplina_id' | 'created_at' | 'updated_at'>): Promise<Disciplina> => {
  // Verificar se já existe disciplina com mesmo nome
  const disciplinaExistente = await connection(tabela)
    .whereILike('nome_disciplina', disciplina.nome_disciplina)
    .first();

  if (disciplinaExistente) {
    throw new Error(`Disciplina "${disciplina.nome_disciplina}" já existe`);
  }

  const [novaDisciplina] = await connection(tabela)
    .insert({
      ...disciplina,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return novaDisciplina;
};

export const atualizar = async (
  disciplina_id: string, 
  dadosAtualizacao: Partial<Omit<Disciplina, 'disciplina_id' | 'created_at' | 'updated_at'>>
): Promise<Disciplina | undefined> => {
  // Se está alterando o nome, verificar se não existe outro com mesmo nome
  if (dadosAtualizacao.nome_disciplina) {
    const disciplinaExistente = await connection(tabela)
      .whereILike('nome_disciplina', dadosAtualizacao.nome_disciplina)
      .whereNot('disciplina_id', disciplina_id)
      .first();

    if (disciplinaExistente) {
      throw new Error(`Disciplina "${dadosAtualizacao.nome_disciplina}" já existe`);
    }
  }

  const [disciplinaAtualizada] = await connection(tabela)
    .where({ disciplina_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date()
    })
    .returning('*');

  return disciplinaAtualizada;
};

export const deletar = async (disciplina_id: string): Promise<boolean> => {
  // Verificar se disciplina está sendo usada em turma_disciplina_professor
  const disciplinaEmUso = await connection('turma_disciplina_professor')
    .where({ disciplina_id })
    .first();

  if (disciplinaEmUso) {
    throw new Error('Não é possível excluir disciplina que está sendo usada por professores');
  }

  const deletados = await connection(tabela)
    .where({ disciplina_id })
    .del();

  return deletados > 0;
};
