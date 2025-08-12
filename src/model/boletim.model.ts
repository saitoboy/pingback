import connection from '../connection';
import { Boletim, BoletimDisciplina } from '../types/models';

const tabela = 'boletim';
const tabelaDisciplina = 'boletim_disciplina';

// ================ CRUD BÁSICO BOLETIM ================

export const listarTodos = async (): Promise<Boletim[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');
};

export const buscarPorId = async (boletim_id: string): Promise<Boletim | undefined> => {
  return await connection(tabela)
    .where({ boletim_id })
    .first();
};

export const criar = async (dadosBoletim: Omit<Boletim, 'boletim_id' | 'created_at' | 'updated_at'>): Promise<Boletim> => {
  // Validar se já existe boletim para o aluno no período
  const boletimExistente = await connection(tabela)
    .where({
      matricula_aluno_id: dadosBoletim.matricula_aluno_id,
      periodo_letivo_id: dadosBoletim.periodo_letivo_id
    })
    .first();

  if (boletimExistente) {
    throw new Error('Já existe um boletim para este aluno neste período letivo');
  }

  // Validar se a matrícula existe e está ativa
  const matricula = await connection('matricula_aluno')
    .where({ matricula_aluno_id: dadosBoletim.matricula_aluno_id })
    .first();

  if (!matricula) {
    throw new Error('Matrícula de aluno não encontrada');
  }

  if (matricula.status !== 'ativo') {
    throw new Error('Não é possível criar boletim para aluno com matrícula inativa');
  }

  // Validar se o período letivo existe
  const periodoLetivo = await connection('periodo_letivo')
    .where({ periodo_letivo_id: dadosBoletim.periodo_letivo_id })
    .first();

  if (!periodoLetivo) {
    throw new Error('Período letivo não encontrado');
  }

  const [novoBoletim] = await connection(tabela)
    .insert(dadosBoletim)
    .returning('*');

  return novoBoletim;
};

export const atualizar = async (
  boletim_id: string,
  dadosAtualizacao: Partial<Omit<Boletim, 'boletim_id' | 'created_at' | 'updated_at'>>
): Promise<Boletim | null> => {
  // Verificar se o boletim existe
  const boletimExistente = await buscarPorId(boletim_id);
  if (!boletimExistente) {
    throw new Error('Boletim não encontrado');
  }

  // Se estiver alterando matrícula ou período, validar unicidade
  if (dadosAtualizacao.matricula_aluno_id || dadosAtualizacao.periodo_letivo_id) {
    const matricula_aluno_id = dadosAtualizacao.matricula_aluno_id || boletimExistente.matricula_aluno_id;
    const periodo_letivo_id = dadosAtualizacao.periodo_letivo_id || boletimExistente.periodo_letivo_id;

    const conflito = await connection(tabela)
      .where({
        matricula_aluno_id,
        periodo_letivo_id
      })
      .whereNot({ boletim_id })
      .first();

    if (conflito) {
      throw new Error('Já existe um boletim para este aluno neste período letivo');
    }
  }

  // Validar matrícula se estiver sendo alterada
  if (dadosAtualizacao.matricula_aluno_id) {
    const matricula = await connection('matricula_aluno')
      .where({ matricula_aluno_id: dadosAtualizacao.matricula_aluno_id })
      .first();

    if (!matricula) {
      throw new Error('Matrícula de aluno não encontrada');
    }

    if (matricula.status !== 'ativo') {
      throw new Error('Não é possível vincular boletim a aluno com matrícula inativa');
    }
  }

  // Validar período letivo se estiver sendo alterado
  if (dadosAtualizacao.periodo_letivo_id) {
    const periodoLetivo = await connection('periodo_letivo')
      .where({ periodo_letivo_id: dadosAtualizacao.periodo_letivo_id })
      .first();

    if (!periodoLetivo) {
      throw new Error('Período letivo não encontrado');
    }
  }

  const [boletimAtualizado] = await connection(tabela)
    .where({ boletim_id })
    .update({
      ...dadosAtualizacao,
      updated_at: connection.fn.now()
    })
    .returning('*');

  return boletimAtualizado || null;
};

export const excluir = async (boletim_id: string): Promise<boolean> => {
  // Verificar se o boletim existe
  const boletimExistente = await buscarPorId(boletim_id);
  if (!boletimExistente) {
    throw new Error('Boletim não encontrado');
  }

  // Verificar se há disciplinas vinculadas
  const disciplinasVinculadas = await connection(tabelaDisciplina)
    .where({ boletim_id })
    .count('* as total')
    .first();

  if (Number(disciplinasVinculadas?.total) > 0) {
    throw new Error('Não é possível excluir boletim que possui disciplinas vinculadas');
  }

  const linhasAfetadas = await connection(tabela)
    .where({ boletim_id })
    .del();

  return linhasAfetadas > 0;
};

// ================ CONSULTAS COM RELACIONAMENTOS ================

export const buscarComDetalhes = async (boletim_id?: string): Promise<any> => {
  let query = connection(tabela)
    .select(
      'b.*',
      'ma.ra',
      'a.nome_aluno',
      'a.sobrenome_aluno',
      't.nome_turma',
      't.turno',
      't.sala',
      's.nome_serie',
      'pl.bimestre',
      'al.ano',
      'al.data_inicio as ano_inicio',
      'al.data_fim as ano_fim'
    )
    .from(`${tabela} as b`)
    .join('matricula_aluno as ma', 'b.matricula_aluno_id', 'ma.matricula_aluno_id')
    .join('aluno as a', 'ma.aluno_id', 'a.aluno_id')
    .join('turma as t', 'ma.turma_id', 't.turma_id')
    .join('serie as s', 't.serie_id', 's.serie_id')
    .join('periodo_letivo as pl', 'b.periodo_letivo_id', 'pl.periodo_letivo_id')
    .join('ano_letivo as al', 'pl.ano_letivo_id', 'al.ano_letivo_id')
    .orderBy('b.created_at', 'desc');

  if (boletim_id) {
    return await query.where('b.boletim_id', boletim_id).first();
  }

  return await query;
};

export const buscarPorMatriculaEPeriodo = async (
  matricula_aluno_id: string,
  periodo_letivo_id: string
): Promise<Boletim | undefined> => {
  return await connection(tabela)
    .where({
      matricula_aluno_id,
      periodo_letivo_id
    })
    .first();
};

export const buscarPorMatricula = async (matricula_aluno_id: string): Promise<Boletim[]> => {
  return await connection(tabela)
    .where({ matricula_aluno_id })
    .orderBy('created_at', 'desc');
};

export const buscarPorPeriodo = async (periodo_letivo_id: string): Promise<Boletim[]> => {
  return await connection(tabela)
    .where({ periodo_letivo_id })
    .orderBy('created_at', 'desc');
};

// ================ CRUD BOLETIM DISCIPLINA ================

export const listarDisciplinasBoletim = async (boletim_id: string): Promise<BoletimDisciplina[]> => {
  return await connection(tabelaDisciplina)
    .where({ boletim_id })
    .orderBy('created_at', 'desc');
};

export const buscarDisciplinaPorId = async (boletim_disciplina_id: string): Promise<BoletimDisciplina | undefined> => {
  return await connection(tabelaDisciplina)
    .where({ boletim_disciplina_id })
    .first();
};

export const criarDisciplinaBoletim = async (
  dadosDisciplina: Omit<BoletimDisciplina, 'boletim_disciplina_id' | 'created_at' | 'updated_at'>
): Promise<BoletimDisciplina> => {
  // Validar se o boletim existe
  const boletim = await buscarPorId(dadosDisciplina.boletim_id);
  if (!boletim) {
    throw new Error('Boletim não encontrado');
  }

  // Validar se a disciplina existe
  const disciplina = await connection('disciplina')
    .where({ disciplina_id: dadosDisciplina.disciplina_id })
    .first();

  if (!disciplina) {
    throw new Error('Disciplina não encontrada');
  }

  // Validar se já existe disciplina no boletim
  const disciplinaExistente = await connection(tabelaDisciplina)
    .where({
      boletim_id: dadosDisciplina.boletim_id,
      disciplina_id: dadosDisciplina.disciplina_id
    })
    .first();

  if (disciplinaExistente) {
    throw new Error('Esta disciplina já está vinculada a este boletim');
  }

  // Validar valores
  if (dadosDisciplina.media_bimestre < 0 || dadosDisciplina.media_bimestre > 10) {
    throw new Error('A média do bimestre deve estar entre 0 e 10');
  }

  if (dadosDisciplina.faltas_bimestre < 0) {
    throw new Error('O número de faltas não pode ser negativo');
  }

  const [novaDisciplina] = await connection(tabelaDisciplina)
    .insert(dadosDisciplina)
    .returning('*');

  return novaDisciplina;
};

export const atualizarDisciplinaBoletim = async (
  boletim_disciplina_id: string,
  dadosAtualizacao: Partial<Omit<BoletimDisciplina, 'boletim_disciplina_id' | 'created_at' | 'updated_at'>>
): Promise<BoletimDisciplina | null> => {
  // Verificar se a disciplina do boletim existe
  const disciplinaExistente = await buscarDisciplinaPorId(boletim_disciplina_id);
  if (!disciplinaExistente) {
    throw new Error('Disciplina do boletim não encontrada');
  }

  // Validar valores se estiverem sendo alterados
  if (dadosAtualizacao.media_bimestre !== undefined) {
    if (dadosAtualizacao.media_bimestre < 0 || dadosAtualizacao.media_bimestre > 10) {
      throw new Error('A média do bimestre deve estar entre 0 e 10');
    }
  }

  if (dadosAtualizacao.faltas_bimestre !== undefined) {
    if (dadosAtualizacao.faltas_bimestre < 0) {
      throw new Error('O número de faltas não pode ser negativo');
    }
  }

  // Se estiver alterando boletim ou disciplina, validar unicidade
  if (dadosAtualizacao.boletim_id || dadosAtualizacao.disciplina_id) {
    const boletim_id = dadosAtualizacao.boletim_id || disciplinaExistente.boletim_id;
    const disciplina_id = dadosAtualizacao.disciplina_id || disciplinaExistente.disciplina_id;

    const conflito = await connection(tabelaDisciplina)
      .where({
        boletim_id,
        disciplina_id
      })
      .whereNot({ boletim_disciplina_id })
      .first();

    if (conflito) {
      throw new Error('Esta disciplina já está vinculada a este boletim');
    }
  }

  const [disciplinaAtualizada] = await connection(tabelaDisciplina)
    .where({ boletim_disciplina_id })
    .update({
      ...dadosAtualizacao,
      updated_at: connection.fn.now()
    })
    .returning('*');

  return disciplinaAtualizada || null;
};

export const excluirDisciplinaBoletim = async (boletim_disciplina_id: string): Promise<boolean> => {
  // Verificar se a disciplina do boletim existe
  const disciplinaExistente = await buscarDisciplinaPorId(boletim_disciplina_id);
  if (!disciplinaExistente) {
    throw new Error('Disciplina do boletim não encontrada');
  }

  const linhasAfetadas = await connection(tabelaDisciplina)
    .where({ boletim_disciplina_id })
    .del();

  return linhasAfetadas > 0;
};

// ================ CONSULTAS COMPLEXAS ================

export const buscarBoletimCompleto = async (boletim_id: string): Promise<any> => {
  // Buscar dados do boletim
  const boletim = await buscarComDetalhes(boletim_id);
  if (!boletim) {
    return null;
  }

  // Buscar disciplinas com detalhes
  const disciplinas = await connection(tabelaDisciplina)
    .select(
      'bd.*',
      'd.nome_disciplina'
    )
    .from(`${tabelaDisciplina} as bd`)
    .join('disciplina as d', 'bd.disciplina_id', 'd.disciplina_id')
    .where('bd.boletim_id', boletim_id)
    .orderBy('d.nome_disciplina');

  return {
    ...boletim,
    disciplinas
  };
};

export const gerarEstatisticas = async (periodo_letivo_id?: string): Promise<any> => {
  let query = connection(tabela)
    .select(
      connection.raw('COUNT(*) as total_boletins'),
      connection.raw('COUNT(DISTINCT matricula_aluno_id) as total_alunos')
    )
    .from(tabela);

  if (periodo_letivo_id) {
    query = query.where({ periodo_letivo_id });
  }

  const estatisticasGerais = await query.first();

  // Estatísticas por disciplina
  let queryDisciplinas = connection(tabelaDisciplina)
    .select(
      'd.nome_disciplina',
      connection.raw('COUNT(*) as total_registros'),
      connection.raw('COALESCE(AVG(bd.media_bimestre), 0) as media_geral'),
      connection.raw('COALESCE(SUM(bd.faltas_bimestre), 0) as total_faltas'),
      connection.raw('COUNT(CASE WHEN bd.media_bimestre >= 6 THEN 1 END) as aprovados'),
      connection.raw('COUNT(CASE WHEN bd.media_bimestre < 6 THEN 1 END) as reprovados')
    )
    .from(`${tabelaDisciplina} as bd`)
    .join('disciplina as d', 'bd.disciplina_id', 'd.disciplina_id')
    .join(`${tabela} as b`, 'bd.boletim_id', 'b.boletim_id');

  if (periodo_letivo_id) {
    queryDisciplinas = queryDisciplinas.where('b.periodo_letivo_id', periodo_letivo_id);
  }

  const estatisticasDisciplinas = await queryDisciplinas
    .groupBy('d.disciplina_id', 'd.nome_disciplina')
    .orderBy('d.nome_disciplina');

  return {
    geral: estatisticasGerais,
    por_disciplina: estatisticasDisciplinas
  };
};
