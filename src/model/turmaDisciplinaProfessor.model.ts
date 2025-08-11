import connection from '../connection';
import { TurmaDisciplinaProfessor } from '../types/models';

const tabela = 'turma_disciplina_professor';

export const listarTodas = async (): Promise<TurmaDisciplinaProfessor[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');
};

export const buscarPorId = async (id: string): Promise<TurmaDisciplinaProfessor | undefined> => {
  return await connection(tabela)
    .where({ turma_disciplina_professor_id: id })
    .first();
};

export const buscarPorTurma = async (turma_id: string): Promise<TurmaDisciplinaProfessor[]> => {
  return await connection(tabela)
    .where({ turma_id })
    .orderBy('created_at', 'desc');
};

export const buscarPorProfessor = async (professor_id: string): Promise<TurmaDisciplinaProfessor[]> => {
  return await connection(tabela)
    .where({ professor_id })
    .orderBy('created_at', 'desc');
};

export const criar = async (
  vinculacao: Omit<TurmaDisciplinaProfessor, 'turma_disciplina_professor_id' | 'created_at' | 'updated_at'>
): Promise<TurmaDisciplinaProfessor> => {
  // Verificar se já existe vinculação
  const existente = await connection(tabela)
    .where({
      turma_id: vinculacao.turma_id,
      disciplina_id: vinculacao.disciplina_id,
      professor_id: vinculacao.professor_id
    })
    .first();

  if (existente) {
    throw new Error('Professor já está vinculado a esta disciplina nesta turma');
  }

  const [novaVinculacao] = await connection(tabela)
    .insert({
      ...vinculacao,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return novaVinculacao;
};

export const atualizar = async (
  id: string,
  dadosAtualizacao: Partial<Omit<TurmaDisciplinaProfessor, 'turma_disciplina_professor_id' | 'created_at' | 'updated_at'>>
): Promise<TurmaDisciplinaProfessor | undefined> => {
  const [vinculacaoAtualizada] = await connection(tabela)
    .where({ turma_disciplina_professor_id: id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date()
    })
    .returning('*');

  return vinculacaoAtualizada;
};

export const deletar = async (id: string): Promise<boolean> => {
  // Verificar se há aulas vinculadas
  const aulasVinculadas = await connection('aula')
    .where({ turma_disciplina_professor_id: id })
    .first();

  if (aulasVinculadas) {
    throw new Error('Não é possível excluir vinculação que possui aulas registradas');
  }

  const deletados = await connection(tabela)
    .where({ turma_disciplina_professor_id: id })
    .del();

  return deletados > 0;
};

// Buscar com joins para detalhes completos
export const buscarComDetalhes = async (id?: string): Promise<any> => {
  let query = connection(tabela)
    .select(
      'tdp.*',
      't.nome_turma',
      'd.nome_disciplina',
      'u.nome_usuario as nome_professor',
      'u.email_usuario as email_professor'
    )
    .from(`${tabela} as tdp`)
    .join('turma as t', 'tdp.turma_id', 't.turma_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .join('professor as p', 'tdp.professor_id', 'p.professor_id')
    .join('usuario as u', 'p.usuario_id', 'u.usuario_id')
    .orderBy('tdp.created_at', 'desc');

  if (id) {
    return await query.where('tdp.turma_disciplina_professor_id', id).first();
  }

  return await query;
};
