import connection from '../connection';
import { Atividade } from '../types/models';

const tabela = 'atividade';

export const listarTodas = async (): Promise<Atividade[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');
};

export const buscarPorId = async (atividade_id: string): Promise<Atividade | undefined> => {
  return await connection(tabela)
    .where({ atividade_id })
    .first();
};

export const buscarPorAula = async (aula_id: string): Promise<Atividade[]> => {
  return await connection(tabela)
    .where({ aula_id })
    .orderBy('created_at', 'asc');
};

export const buscarPorVinculacao = async (turma_disciplina_professor_id: string): Promise<Atividade[]> => {
  return await connection(tabela)
    .where({ turma_disciplina_professor_id })
    .orderBy('created_at', 'desc');
};

export const buscarPorPeriodo = async (periodo_letivo_id: string): Promise<Atividade[]> => {
  return await connection(tabela)
    .where({ periodo_letivo_id })
    .orderBy('created_at', 'desc');
};

export const buscarQueValemNota = async (turma_disciplina_professor_id?: string): Promise<Atividade[]> => {
  let query = connection(tabela)
    .where({ vale_nota: true })
    .orderBy('created_at', 'desc');
  
  if (turma_disciplina_professor_id) {
    query = query.where({ turma_disciplina_professor_id });
  }
  
  return await query;
};

export const criar = async (
  atividade: Omit<Atividade, 'atividade_id' | 'created_at' | 'updated_at'>
): Promise<Atividade> => {
  // Verificar se a aula existe
  const aulaExiste = await connection('aula')
    .where({ aula_id: atividade.aula_id })
    .first();

  if (!aulaExiste) {
    throw new Error('Aula não encontrada');
  }

  // Verificar se a vinculação existe
  const vinculacaoExiste = await connection('turma_disciplina_professor')
    .where({ turma_disciplina_professor_id: atividade.turma_disciplina_professor_id })
    .first();

  if (!vinculacaoExiste) {
    throw new Error('Vinculação professor-turma-disciplina não encontrada');
  }

  // Verificar se o período letivo existe
  const periodoExiste = await connection('periodo_letivo')
    .where({ periodo_letivo_id: atividade.periodo_letivo_id })
    .first();

  if (!periodoExiste) {
    throw new Error('Período letivo não encontrado');
  }

  // Validar peso (deve ser positivo)
  if (atividade.peso <= 0) {
    throw new Error('O peso da atividade deve ser maior que zero');
  }

  const [novaAtividade] = await connection(tabela)
    .insert({
      ...atividade,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return novaAtividade;
};

export const atualizar = async (
  atividade_id: string,
  dadosAtualizacao: Partial<Omit<Atividade, 'atividade_id' | 'created_at' | 'updated_at'>>
): Promise<Atividade | undefined> => {
  // Validar peso se estiver sendo atualizado
  if (dadosAtualizacao.peso !== undefined && dadosAtualizacao.peso <= 0) {
    throw new Error('O peso da atividade deve ser maior que zero');
  }

  // Se estiver alterando aula_id, verificar se a nova aula existe
  if (dadosAtualizacao.aula_id) {
    const aulaExiste = await connection('aula')
      .where({ aula_id: dadosAtualizacao.aula_id })
      .first();

    if (!aulaExiste) {
      throw new Error('Aula não encontrada');
    }
  }

  // Se estiver alterando periodo_letivo_id, verificar se existe
  if (dadosAtualizacao.periodo_letivo_id) {
    const periodoExiste = await connection('periodo_letivo')
      .where({ periodo_letivo_id: dadosAtualizacao.periodo_letivo_id })
      .first();

    if (!periodoExiste) {
      throw new Error('Período letivo não encontrado');
    }
  }

  const [atividadeAtualizada] = await connection(tabela)
    .where({ atividade_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date()
    })
    .returning('*');

  return atividadeAtualizada;
};

export const deletar = async (atividade_id: string): Promise<boolean> => {
  // Verificar se há notas vinculadas
  const notasVinculadas = await connection('nota')
    .where({ atividade_id })
    .first();

  if (notasVinculadas) {
    throw new Error('Não é possível excluir atividade que possui notas registradas');
  }

  const deletados = await connection(tabela)
    .where({ atividade_id })
    .del();

  return deletados > 0;
};

// Buscar atividades com detalhes da aula, vinculação e período
export const buscarComDetalhes = async (atividade_id?: string): Promise<any> => {
  let query = connection(tabela)
    .select(
      'a.*',
      'aula.data_aula',
      'aula.hora_inicio',
      'aula.hora_fim',
      't.nome_turma',
      'd.nome_disciplina',
      'u.nome_usuario as nome_professor',
      'u.email_usuario as email_professor',
      'pl.bimestre'
    )
    .from(`${tabela} as a`)
    .join('aula', 'a.aula_id', 'aula.aula_id')
    .join('turma_disciplina_professor as tdp', 'a.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('turma as t', 'tdp.turma_id', 't.turma_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .join('professor as p', 'tdp.professor_id', 'p.professor_id')
    .join('usuario as u', 'p.usuario_id', 'u.usuario_id')
    .join('periodo_letivo as pl', 'a.periodo_letivo_id', 'pl.periodo_letivo_id')
    .orderBy('a.created_at', 'desc');

  if (atividade_id) {
    return await query.where('a.atividade_id', atividade_id).first();
  }

  return await query;
};

// Verificar se um professor tem acesso a uma atividade (é o professor responsável)
export const verificarAcessoProfessor = async (
  atividade_id: string, 
  professor_id: string
): Promise<boolean> => {
  const atividade = await connection(tabela)
    .join('turma_disciplina_professor as tdp', 'atividade.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .where('atividade.atividade_id', atividade_id)
    .where('tdp.professor_id', professor_id)
    .first();

  return !!atividade;
};

// Estatísticas de atividades por professor
export const estatisticasPorProfessor = async (professor_id: string): Promise<any> => {
  const estatisticas = await connection(tabela)
    .join('turma_disciplina_professor as tdp', 'atividade.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .where('tdp.professor_id', professor_id)
    .select(
      connection.raw('COUNT(*) as total_atividades'),
      connection.raw('COUNT(CASE WHEN vale_nota = true THEN 1 END) as atividades_avaliativas'),
      connection.raw('COUNT(CASE WHEN vale_nota = false THEN 1 END) as atividades_praticas'),
      connection.raw('AVG(peso) as peso_medio')
    )
    .first();

  return estatisticas;
};
