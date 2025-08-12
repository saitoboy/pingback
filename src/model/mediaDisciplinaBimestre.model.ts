import connection from '../connection';
import { MediaDisciplinaBimestre } from '../types/models';

const tabela = 'media_disciplina_bimestre';

export const listarTodas = async (): Promise<MediaDisciplinaBimestre[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');
};

export const buscarPorId = async (media_disciplina_bimestre_id: string): Promise<MediaDisciplinaBimestre | undefined> => {
  return await connection(tabela)
    .where({ media_disciplina_bimestre_id })
    .first();
};

export const buscarComDetalhes = async (media_disciplina_bimestre_id?: string): Promise<any> => {
  let query = connection(tabela)
    .select(
      'mdb.*',
      'ma.ra',
      'a.nome_aluno',
      'a.sobrenome_aluno',
      'd.nome_disciplina',
      'pl.bimestre',
      'pl.ano_letivo_id',
      't.nome_turma',
      't.turno',
      't.sala'
    )
    .from(`${tabela} as mdb`)
    .join('matricula_aluno as ma', 'mdb.matricula_aluno_id', 'ma.matricula_aluno_id')
    .join('aluno as a', 'ma.aluno_id', 'a.aluno_id')
    .join('turma_disciplina_professor as tdp', 'mdb.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .join('periodo_letivo as pl', 'mdb.periodo_letivo_id', 'pl.periodo_letivo_id')
    .join('turma as t', 'ma.turma_id', 't.turma_id')
    .orderBy('mdb.created_at', 'desc');

  if (media_disciplina_bimestre_id) {
    return await query.where('mdb.media_disciplina_bimestre_id', media_disciplina_bimestre_id).first();
  }

  return await query;
};

export const buscarPorMatricula = async (matricula_aluno_id: string): Promise<MediaDisciplinaBimestre[]> => {
  return await connection(tabela)
    .where({ matricula_aluno_id })
    .orderBy('created_at', 'desc');
};

export const buscarPorAluno = async (aluno_id: string): Promise<any[]> => {
  return await connection(tabela)
    .select(
      'mdb.*',
      'ma.ra',
      'd.nome_disciplina',
      'pl.bimestre',
      'pl.ano_letivo_id',
      't.nome_turma'
    )
    .from(`${tabela} as mdb`)
    .join('matricula_aluno as ma', 'mdb.matricula_aluno_id', 'ma.matricula_aluno_id')
    .join('turma_disciplina_professor as tdp', 'mdb.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .join('periodo_letivo as pl', 'mdb.periodo_letivo_id', 'pl.periodo_letivo_id')
    .join('turma as t', 'ma.turma_id', 't.turma_id')
    .where('ma.aluno_id', aluno_id)
    .orderBy('pl.ano_letivo_id', 'desc')
    .orderBy('pl.bimestre', 'desc');
};

export const buscarPorTurmaEDisciplina = async (
  turma_id: string, 
  disciplina_id: string, 
  periodo_letivo_id?: string
): Promise<any[]> => {
  let query = connection(tabela)
    .select(
      'mdb.*',
      'ma.ra',
      'a.nome_aluno',
      'a.sobrenome_aluno',
      'd.nome_disciplina',
      'pl.bimestre',
      'pl.ano_letivo_id',
      't.nome_turma'
    )
    .from(`${tabela} as mdb`)
    .join('matricula_aluno as ma', 'mdb.matricula_aluno_id', 'ma.matricula_aluno_id')
    .join('aluno as a', 'ma.aluno_id', 'a.aluno_id')
    .join('turma_disciplina_professor as tdp', 'mdb.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .join('periodo_letivo as pl', 'mdb.periodo_letivo_id', 'pl.periodo_letivo_id')
    .join('turma as t', 'ma.turma_id', 't.turma_id')
    .where('t.turma_id', turma_id)
    .where('tdp.disciplina_id', disciplina_id)
    .orderBy('a.nome_aluno', 'asc')
    .orderBy('a.sobrenome_aluno', 'asc');

  if (periodo_letivo_id) {
    query = query.where('mdb.periodo_letivo_id', periodo_letivo_id);
  }

  return await query;
};

export const buscarPorPeriodoLetivo = async (periodo_letivo_id: string): Promise<MediaDisciplinaBimestre[]> => {
  return await connection(tabela)
    .where({ periodo_letivo_id })
    .orderBy('created_at', 'desc');
};

// Verificar se já existe uma média para a mesma matrícula, turma_disciplina_professor e período
export const verificarExistenciaPorChaveUnica = async (
  matricula_aluno_id: string,
  turma_disciplina_professor_id: string,
  periodo_letivo_id: string,
  media_disciplina_bimestre_id?: string
): Promise<MediaDisciplinaBimestre | undefined> => {
  let query = connection(tabela)
    .where({ matricula_aluno_id, turma_disciplina_professor_id, periodo_letivo_id });

  if (media_disciplina_bimestre_id) {
    query = query.whereNot({ media_disciplina_bimestre_id });
  }

  return await query.first();
};

export const verificarMatriculaValida = async (matricula_aluno_id: string): Promise<boolean> => {
  const matricula = await connection('matricula_aluno')
    .where({ matricula_aluno_id })
    .first();

  return !!matricula;
};

export const verificarTurmaDisciplinaProfessorValida = async (turma_disciplina_professor_id: string): Promise<boolean> => {
  const turmaDisciplinaProfessor = await connection('turma_disciplina_professor')
    .where({ turma_disciplina_professor_id })
    .first();

  return !!turmaDisciplinaProfessor;
};

export const verificarDisciplinaValida = async (disciplina_id: string): Promise<boolean> => {
  const disciplina = await connection('disciplina')
    .where({ disciplina_id })
    .first();

  return !!disciplina;
};

export const verificarPeriodoLetivoValido = async (periodo_letivo_id: string): Promise<boolean> => {
  const periodo = await connection('periodo_letivo')
    .where({ periodo_letivo_id })
    .first();

  return !!periodo;
};

export const criar = async (
  mediaDisciplinaBimestre: Omit<MediaDisciplinaBimestre, 'media_disciplina_bimestre_id' | 'created_at' | 'updated_at'>
): Promise<MediaDisciplinaBimestre> => {
  // Verificar se a matrícula existe
  const matriculaValida = await verificarMatriculaValida(mediaDisciplinaBimestre.matricula_aluno_id);
  if (!matriculaValida) {
    throw new Error('Matrícula do aluno não encontrada');
  }

  // Verificar se a turma_disciplina_professor existe
  const turmaDisciplinaProfessorValida = await verificarTurmaDisciplinaProfessorValida(mediaDisciplinaBimestre.turma_disciplina_professor_id);
  if (!turmaDisciplinaProfessorValida) {
    throw new Error('Turma-disciplina-professor não encontrada');
  }

  // Verificar se o período letivo existe
  const periodoValido = await verificarPeriodoLetivoValido(mediaDisciplinaBimestre.periodo_letivo_id);
  if (!periodoValido) {
    throw new Error('Período letivo não encontrado');
  }

  // Verificar se já existe uma média para a mesma chave única
  const mediaExistente = await verificarExistenciaPorChaveUnica(
    mediaDisciplinaBimestre.matricula_aluno_id,
    mediaDisciplinaBimestre.turma_disciplina_professor_id,
    mediaDisciplinaBimestre.periodo_letivo_id
  );

  if (mediaExistente) {
    throw new Error('Já existe uma média registrada para este aluno, turma-disciplina-professor e período letivo');
  }

  // Validar valor da média (deve estar entre 0 e 10)
  if (mediaDisciplinaBimestre.valor_media < 0 || mediaDisciplinaBimestre.valor_media > 10) {
    throw new Error('O valor da média deve estar entre 0 e 10');
  }

  const [novaMedia] = await connection(tabela)
    .insert({
      ...mediaDisciplinaBimestre,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return novaMedia;
};

export const atualizar = async (
  media_disciplina_bimestre_id: string,
  dadosAtualizacao: Partial<Omit<MediaDisciplinaBimestre, 'media_disciplina_bimestre_id' | 'created_at' | 'updated_at'>>
): Promise<MediaDisciplinaBimestre | undefined> => {
  // Validar valor da média se estiver sendo atualizado
  if (dadosAtualizacao.valor_media !== undefined) {
    if (dadosAtualizacao.valor_media < 0 || dadosAtualizacao.valor_media > 10) {
      throw new Error('O valor da média deve estar entre 0 e 10');
    }
  }

  // Se estiver alterando matrícula, verificar se existe
  if (dadosAtualizacao.matricula_aluno_id) {
    const matriculaValida = await verificarMatriculaValida(dadosAtualizacao.matricula_aluno_id);
    if (!matriculaValida) {
      throw new Error('Matrícula do aluno não encontrada');
    }
  }

  // Se estiver alterando turma_disciplina_professor, verificar se existe
  if (dadosAtualizacao.turma_disciplina_professor_id) {
    const turmaDisciplinaProfessorValida = await verificarTurmaDisciplinaProfessorValida(dadosAtualizacao.turma_disciplina_professor_id);
    if (!turmaDisciplinaProfessorValida) {
      throw new Error('Turma-disciplina-professor não encontrada');
    }
  }

  // Se estiver alterando período letivo, verificar se existe
  if (dadosAtualizacao.periodo_letivo_id) {
    const periodoValido = await verificarPeriodoLetivoValido(dadosAtualizacao.periodo_letivo_id);
    if (!periodoValido) {
      throw new Error('Período letivo não encontrado');
    }
  }

  // Verificar unicidade se alguma das chaves estiver sendo alterada
  if (dadosAtualizacao.matricula_aluno_id || dadosAtualizacao.turma_disciplina_professor_id || dadosAtualizacao.periodo_letivo_id) {
    const mediaAtual = await buscarPorId(media_disciplina_bimestre_id);
    if (!mediaAtual) {
      throw new Error('Média não encontrada');
    }

    const novaMatricula = dadosAtualizacao.matricula_aluno_id || mediaAtual.matricula_aluno_id;
    const novaTurmaDisciplinaProfessor = dadosAtualizacao.turma_disciplina_professor_id || mediaAtual.turma_disciplina_professor_id;
    const novoPeriodo = dadosAtualizacao.periodo_letivo_id || mediaAtual.periodo_letivo_id;

    const mediaExistente = await verificarExistenciaPorChaveUnica(
      novaMatricula,
      novaTurmaDisciplinaProfessor,
      novoPeriodo,
      media_disciplina_bimestre_id
    );

    if (mediaExistente) {
      throw new Error('Já existe uma média registrada para este aluno, turma-disciplina-professor e período letivo');
    }
  }

  const [mediaAtualizada] = await connection(tabela)
    .where({ media_disciplina_bimestre_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date()
    })
    .returning('*');

  return mediaAtualizada;
};

export const deletar = async (media_disciplina_bimestre_id: string): Promise<boolean> => {
  const deletados = await connection(tabela)
    .where({ media_disciplina_bimestre_id })
    .del();

  return deletados > 0;
};

// Estatísticas de médias por aluno
export const obterEstatisticasPorAluno = async (aluno_id: string): Promise<any> => {
  const estatisticas = await connection(tabela)
    .select(
      connection.raw('COUNT(*) as total_medias'),
      connection.raw('AVG(valor_media) as media_geral'),
      connection.raw('MIN(valor_media) as menor_media'),
      connection.raw('MAX(valor_media) as maior_media'),
      connection.raw('COUNT(CASE WHEN valor_media >= 7 THEN 1 END) as medias_aprovadas'),
      connection.raw('COUNT(CASE WHEN valor_media < 7 THEN 1 END) as medias_reprovadas')
    )
    .join('matricula_aluno as ma', 'media_disciplina_bimestre.matricula_aluno_id', 'ma.matricula_aluno_id')
    .where('ma.aluno_id', aluno_id)
    .first();

  return estatisticas;
};

// Estatísticas de médias por turma e disciplina
export const obterEstatisticasPorTurmaDisciplina = async (
  turma_id: string, 
  disciplina_id: string, 
  periodo_letivo_id?: string
): Promise<any> => {
  let query = connection(tabela)
    .select(
      connection.raw('COUNT(*) as total_alunos'),
      connection.raw('AVG(valor_media) as media_turma'),
      connection.raw('MIN(valor_media) as menor_media'),
      connection.raw('MAX(valor_media) as maior_media'),
      connection.raw('COUNT(CASE WHEN valor_media >= 7 THEN 1 END) as alunos_aprovados'),
      connection.raw('COUNT(CASE WHEN valor_media < 7 THEN 1 END) as alunos_reprovados')
    )
    .join('matricula_aluno as ma', 'media_disciplina_bimestre.matricula_aluno_id', 'ma.matricula_aluno_id')
    .join('turma_disciplina_professor as tdp', 'media_disciplina_bimestre.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .where('ma.turma_id', turma_id)
    .where('tdp.disciplina_id', disciplina_id);

  if (periodo_letivo_id) {
    query = query.where('media_disciplina_bimestre.periodo_letivo_id', periodo_letivo_id);
  }

  return await query.first();
};
