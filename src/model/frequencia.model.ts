import connection from '../connection';
import { Frequencia } from '../types/models';

const tabela = 'frequencia';

export const listarTodas = async (): Promise<Frequencia[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('created_at', 'desc');
};

export const buscarPorId = async (frequencia_id: string): Promise<Frequencia | undefined> => {
  return await connection(tabela)
    .where({ frequencia_id })
    .first();
};

export const buscarComDetalhes = async (frequencia_id?: string): Promise<any> => {
  let query = connection(tabela)
    .select(
      'f.*',
      'ma.ra',
      'a.nome_aluno',
      'a.sobrenome_aluno',
      't.nome_turma',
      't.turno',
      't.sala',
      'd.nome_disciplina',
      'p.nome_usuario as nome_professor',
      'au.data_aula',
      'au.hora_inicio',
      'au.hora_fim'
    )
    .from(`${tabela} as f`)
    .join('matricula_aluno as ma', 'f.matricula_aluno_id', 'ma.matricula_aluno_id')
    .join('aluno as a', 'ma.aluno_id', 'a.aluno_id')
    .join('turma as t', 'ma.turma_id', 't.turma_id')
    .join('aula as au', 'f.aula_id', 'au.aula_id')
    .join('turma_disciplina_professor as tdp', 'au.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .join('professor as prof', 'tdp.professor_id', 'prof.professor_id')
    .join('usuario as p', 'prof.usuario_id', 'p.usuario_id')
    .orderBy('f.created_at', 'desc');

  if (frequencia_id) {
    return await query.where('f.frequencia_id', frequencia_id).first();
  }

  return await query;
};

export const buscarPorMatricula = async (matricula_aluno_id: string): Promise<Frequencia[]> => {
  return await connection(tabela)
    .where({ matricula_aluno_id })
    .orderBy('created_at', 'desc');
};

export const buscarPorAluno = async (aluno_id: string): Promise<any[]> => {
  return await connection(tabela)
    .select(
      'f.*',
      'ma.ra',
      'd.nome_disciplina',
      't.nome_turma',
      'au.data_aula',
      'au.hora_inicio',
      'au.hora_fim'
    )
    .from(`${tabela} as f`)
    .join('matricula_aluno as ma', 'f.matricula_aluno_id', 'ma.matricula_aluno_id')
    .join('aula as au', 'f.aula_id', 'au.aula_id')
    .join('turma_disciplina_professor as tdp', 'au.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .join('turma as t', 'ma.turma_id', 't.turma_id')
    .where('ma.aluno_id', aluno_id)
    .orderBy('au.data_aula', 'desc')
    .orderBy('au.hora_inicio', 'desc');
};

export const buscarPorAula = async (aula_id: string): Promise<any[]> => {
  return await connection(tabela)
    .select(
      'f.*',
      'ma.ra',
      'a.nome_aluno',
      'a.sobrenome_aluno',
      't.nome_turma',
      'd.nome_disciplina',
      'au.data_aula',
      'au.hora_inicio',
      'au.hora_fim'
    )
    .from(`${tabela} as f`)
    .join('matricula_aluno as ma', 'f.matricula_aluno_id', 'ma.matricula_aluno_id')
    .join('aluno as a', 'ma.aluno_id', 'a.aluno_id')
    .join('turma as t', 'ma.turma_id', 't.turma_id')
    .join('aula as au', 'f.aula_id', 'au.aula_id')
    .join('turma_disciplina_professor as tdp', 'au.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .where('f.aula_id', aula_id)
    .orderBy('a.nome_aluno', 'asc')
    .orderBy('a.sobrenome_aluno', 'asc');
};

export const buscarPorTurmaEData = async (
  turma_id: string, 
  data_aula: string, 
  disciplina_id?: string
): Promise<any[]> => {
  let query = connection(tabela)
    .select(
      'f.*',
      'ma.ra',
      'a.nome_aluno',
      'a.sobrenome_aluno',
      'd.nome_disciplina',
      'au.data_aula',
      'au.hora_inicio',
      'au.hora_fim'
    )
    .from(`${tabela} as f`)
    .join('matricula_aluno as ma', 'f.matricula_aluno_id', 'ma.matricula_aluno_id')
    .join('aluno as a', 'ma.aluno_id', 'a.aluno_id')
    .join('aula as au', 'f.aula_id', 'au.aula_id')
    .join('turma_disciplina_professor as tdp', 'au.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .where('ma.turma_id', turma_id)
    .where('au.data_aula', data_aula)
    .orderBy('a.nome_aluno', 'asc')
    .orderBy('a.sobrenome_aluno', 'asc');

  if (disciplina_id) {
    query = query.where('tdp.disciplina_id', disciplina_id);
  }

  return await query;
};

// Verificar se já existe uma frequência para a mesma matrícula e aula
export const verificarExistenciaPorChaveUnica = async (
  matricula_aluno_id: string,
  aula_id: string,
  frequencia_id?: string
): Promise<Frequencia | undefined> => {
  let query = connection(tabela)
    .where({ matricula_aluno_id, aula_id });

  if (frequencia_id) {
    query = query.whereNot({ frequencia_id });
  }

  return await query.first();
};

export const verificarMatriculaValida = async (matricula_aluno_id: string): Promise<boolean> => {
  const matricula = await connection('matricula_aluno')
    .where({ matricula_aluno_id })
    .first();

  return !!matricula;
};

export const verificarAulaValida = async (aula_id: string): Promise<boolean> => {
  const aula = await connection('aula')
    .where({ aula_id })
    .first();

  return !!aula;
};

export const criar = async (
  frequencia: Omit<Frequencia, 'frequencia_id' | 'created_at' | 'updated_at'>
): Promise<Frequencia> => {
  // Verificar se a matrícula existe
  const matriculaValida = await verificarMatriculaValida(frequencia.matricula_aluno_id);
  if (!matriculaValida) {
    throw new Error('Matrícula do aluno não encontrada');
  }

  // Verificar se a aula existe
  const aulaValida = await verificarAulaValida(frequencia.aula_id);
  if (!aulaValida) {
    throw new Error('Aula não encontrada');
  }

  // Verificar se já existe uma frequência para a mesma chave única
  const frequenciaExistente = await verificarExistenciaPorChaveUnica(
    frequencia.matricula_aluno_id,
    frequencia.aula_id
  );

  if (frequenciaExistente) {
    throw new Error('Já existe uma frequência registrada para este aluno nesta aula');
  }

  const [novaFrequencia] = await connection(tabela)
    .insert({
      ...frequencia,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return novaFrequencia;
};

export const atualizar = async (
  frequencia_id: string,
  dadosAtualizacao: Partial<Omit<Frequencia, 'frequencia_id' | 'created_at' | 'updated_at'>>
): Promise<Frequencia | undefined> => {
  // Se estiver alterando matrícula, verificar se existe
  if (dadosAtualizacao.matricula_aluno_id) {
    const matriculaValida = await verificarMatriculaValida(dadosAtualizacao.matricula_aluno_id);
    if (!matriculaValida) {
      throw new Error('Matrícula do aluno não encontrada');
    }
  }

  // Se estiver alterando aula, verificar se existe
  if (dadosAtualizacao.aula_id) {
    const aulaValida = await verificarAulaValida(dadosAtualizacao.aula_id);
    if (!aulaValida) {
      throw new Error('Aula não encontrada');
    }
  }

  // Verificar unicidade se alguma das chaves estiver sendo alterada
  if (dadosAtualizacao.matricula_aluno_id || dadosAtualizacao.aula_id) {
    const frequenciaAtual = await buscarPorId(frequencia_id);
    if (!frequenciaAtual) {
      throw new Error('Frequência não encontrada');
    }

    const novaMatricula = dadosAtualizacao.matricula_aluno_id || frequenciaAtual.matricula_aluno_id;
    const novaAula = dadosAtualizacao.aula_id || frequenciaAtual.aula_id;

    const frequenciaExistente = await verificarExistenciaPorChaveUnica(
      novaMatricula,
      novaAula,
      frequencia_id
    );

    if (frequenciaExistente) {
      throw new Error('Já existe uma frequência registrada para este aluno nesta aula');
    }
  }

  const [frequenciaAtualizada] = await connection(tabela)
    .where({ frequencia_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date()
    })
    .returning('*');

  return frequenciaAtualizada;
};

export const deletar = async (frequencia_id: string): Promise<boolean> => {
  const deletados = await connection(tabela)
    .where({ frequencia_id })
    .del();

  return deletados > 0;
};

// Estatísticas de presença por aluno
export const obterEstatisticasPorAluno = async (aluno_id: string): Promise<any> => {
  const estatisticas = await connection(tabela)
    .select(
      connection.raw('COUNT(*) as total_aulas'),
      connection.raw('COUNT(CASE WHEN presenca = true THEN 1 END) as presencas'),
      connection.raw('COUNT(CASE WHEN presenca = false THEN 1 END) as faltas'),
      connection.raw(`
        CASE 
          WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND((COUNT(CASE WHEN presenca = true THEN 1 END)::decimal / COUNT(*)) * 100, 2)
        END as percentual_presenca
      `)
    )
    .join('matricula_aluno as ma', 'frequencia.matricula_aluno_id', 'ma.matricula_aluno_id')
    .where('ma.aluno_id', aluno_id)
    .first();

  return estatisticas;
};

// Estatísticas de presença por turma e disciplina
export const obterEstatisticasPorTurmaDisciplina = async (
  turma_id: string, 
  disciplina_id: string, 
  data_inicio?: string,
  data_fim?: string
): Promise<any> => {
  let query = connection(tabela)
    .select(
      connection.raw('COUNT(*) as total_chamadas'),
      connection.raw('COUNT(CASE WHEN presenca = true THEN 1 END) as total_presencas'),
      connection.raw('COUNT(CASE WHEN presenca = false THEN 1 END) as total_faltas'),
      connection.raw(`
        CASE 
          WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND((COUNT(CASE WHEN presenca = true THEN 1 END)::decimal / COUNT(*)) * 100, 2)
        END as percentual_presenca_geral
      `)
    )
    .join('matricula_aluno as ma', 'frequencia.matricula_aluno_id', 'ma.matricula_aluno_id')
    .join('aula as au', 'frequencia.aula_id', 'au.aula_id')
    .join('turma_disciplina_professor as tdp', 'au.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .where('ma.turma_id', turma_id)
    .where('tdp.disciplina_id', disciplina_id);

  if (data_inicio && data_fim) {
    query = query.whereBetween('au.data_aula', [data_inicio, data_fim]);
  } else if (data_inicio) {
    query = query.where('au.data_aula', '>=', data_inicio);
  } else if (data_fim) {
    query = query.where('au.data_aula', '<=', data_fim);
  }

  return await query.first();
};

// Registrar frequência em lote para uma aula (upsert)
export const registrarFrequenciaLote = async (
  aula_id: string,
  frequencias: Array<{ matricula_aluno_id: string; presenca: boolean }>
): Promise<Frequencia[]> => {
  // Verificar se a aula existe
  const aulaValida = await verificarAulaValida(aula_id);
  if (!aulaValida) {
    throw new Error('Aula não encontrada');
  }

  const now = new Date();
  const frequenciasResultadas: Frequencia[] = [];

  // Processar cada frequência individualmente
  for (const freq of frequencias) {
    // Verificar se a matrícula é válida
    const matriculaValida = await verificarMatriculaValida(freq.matricula_aluno_id);
    if (!matriculaValida) {
      throw new Error(`Matrícula ${freq.matricula_aluno_id} não encontrada`);
    }

    // Verificar se já existe frequência para esta matrícula nesta aula
    const existente = await verificarExistenciaPorChaveUnica(freq.matricula_aluno_id, aula_id);
    
    if (existente) {
      // Atualizar frequência existente
      const [frequenciaAtualizada] = await connection(tabela)
        .where('aula_id', aula_id)
        .where('matricula_aluno_id', freq.matricula_aluno_id)
        .update({
          presenca: freq.presenca,
          updated_at: now
        })
        .returning('*');
      
      frequenciasResultadas.push(frequenciaAtualizada);
    } else {
      // Inserir nova frequência
      const [novaFrequencia] = await connection(tabela)
        .insert({
          aula_id,
          matricula_aluno_id: freq.matricula_aluno_id,
          presenca: freq.presenca,
          created_at: now,
          updated_at: now
        })
        .returning('*');
      
      frequenciasResultadas.push(novaFrequencia);
    }
  }

  return frequenciasResultadas;
};
