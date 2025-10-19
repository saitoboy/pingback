import connection from '../connection';
import { Nota } from '../types/models';

const tabela = 'nota';

export const listarTodas = async (): Promise<Nota[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('valor', 'desc');
};

export const buscarPorId = async (nota_id: string): Promise<Nota | undefined> => {
  return await connection(tabela)
    .where({ nota_id })
    .first();
};

export const buscarPorAtividade = async (atividade_id: string): Promise<any[]> => {
  return await connection(tabela)
    .select(
      'nota.*',
      'matricula_aluno.ra',
      'aluno.nome_aluno',
      'aluno.sobrenome_aluno'
    )
    .leftJoin('matricula_aluno', 'nota.matricula_aluno_id', 'matricula_aluno.matricula_aluno_id')
    .leftJoin('aluno', 'matricula_aluno.aluno_id', 'aluno.aluno_id')
    .where('nota.atividade_id', atividade_id)
    .orderBy('nota.valor', 'desc');
};

export const buscarPorAluno = async (matricula_aluno_id: string): Promise<Nota[]> => {
  return await connection(tabela)
    .where({ matricula_aluno_id })
    .orderBy('valor', 'desc');
};

export const buscarPorAlunoEAtividade = async (
  matricula_aluno_id: string, 
  atividade_id: string
): Promise<Nota | undefined> => {
  return await connection(tabela)
    .where({ matricula_aluno_id, atividade_id })
    .first();
};

// Buscar notas com detalhes (JOIN com atividade, aluno, etc.)
export const buscarComDetalhes = async (): Promise<any[]> => {
  return await connection(tabela)
    .select(
      'nota.*',
      'atividade.titulo as atividade_titulo',
      'atividade.peso as atividade_peso',
      'atividade.vale_nota',
      'atividade.periodo_letivo_id',
      'periodo_letivo.bimestre',
      'matricula_aluno.ra',
      'aluno.nome_aluno',
      'aluno.sobrenome_aluno',
      'disciplina.nome_disciplina',
      'turma.nome_turma'
    )
    .leftJoin('atividade', 'nota.atividade_id', 'atividade.atividade_id')
    .leftJoin('periodo_letivo', 'atividade.periodo_letivo_id', 'periodo_letivo.periodo_letivo_id')
    .leftJoin('matricula_aluno', 'nota.matricula_aluno_id', 'matricula_aluno.matricula_aluno_id')
    .leftJoin('aluno', 'matricula_aluno.aluno_id', 'aluno.aluno_id')
    .leftJoin('turma_disciplina_professor', 'atividade.turma_disciplina_professor_id', 'turma_disciplina_professor.turma_disciplina_professor_id')
    .leftJoin('disciplina', 'turma_disciplina_professor.disciplina_id', 'disciplina.disciplina_id')
    .leftJoin('turma', 'turma_disciplina_professor.turma_id', 'turma.turma_id')
    .orderBy('nota.valor', 'desc');
};

export const buscarComDetalhesPorId = async (nota_id: string): Promise<any | undefined> => {
  return await connection(tabela)
    .select(
      'nota.*',
      'atividade.titulo as atividade_titulo',
      'atividade.peso as atividade_peso',
      'atividade.vale_nota',
      'atividade.periodo_letivo_id',
      'periodo_letivo.bimestre',
      'matricula_aluno.ra',
      'aluno.nome_aluno',
      'aluno.sobrenome_aluno',
      'disciplina.nome_disciplina',
      'turma.nome_turma'
    )
    .leftJoin('atividade', 'nota.atividade_id', 'atividade.atividade_id')
    .leftJoin('periodo_letivo', 'atividade.periodo_letivo_id', 'periodo_letivo.periodo_letivo_id')
    .leftJoin('matricula_aluno', 'nota.matricula_aluno_id', 'matricula_aluno.matricula_aluno_id')
    .leftJoin('aluno', 'matricula_aluno.aluno_id', 'aluno.aluno_id')
    .leftJoin('turma_disciplina_professor', 'atividade.turma_disciplina_professor_id', 'turma_disciplina_professor.turma_disciplina_professor_id')
    .leftJoin('disciplina', 'turma_disciplina_professor.disciplina_id', 'disciplina.disciplina_id')
    .leftJoin('turma', 'turma_disciplina_professor.turma_id', 'turma.turma_id')
    .where('nota.nota_id', nota_id)
    .first();
};

// Buscar notas por turma e disciplina
export const buscarPorTurmaEDisciplina = async (
  turma_id: string, 
  disciplina_id: string
): Promise<any[]> => {
  return await connection(tabela)
    .select(
      'nota.*',
      'atividade.titulo as atividade_titulo',
      'atividade.peso as atividade_peso',
      'matricula_aluno.ra',
      'aluno.nome_aluno',
      'aluno.sobrenome_aluno'
    )
    .leftJoin('atividade', 'nota.atividade_id', 'atividade.atividade_id')
    .leftJoin('matricula_aluno', 'nota.matricula_aluno_id', 'matricula_aluno.matricula_aluno_id')
    .leftJoin('aluno', 'matricula_aluno.aluno_id', 'aluno.aluno_id')
    .leftJoin('turma_disciplina_professor', 'atividade.turma_disciplina_professor_id', 'turma_disciplina_professor.turma_disciplina_professor_id')
    .where('turma_disciplina_professor.turma_id', turma_id)
    .where('turma_disciplina_professor.disciplina_id', disciplina_id)
    .orderBy('aluno.nome_aluno', 'asc')
    .orderBy('atividade.titulo', 'asc');
};

// Buscar estatísticas de notas por aluno
export const estatisticasPorAluno = async (matricula_aluno_id: string): Promise<any> => {
  const stats = await connection(tabela)
    .select(
      connection.raw('COUNT(*) as total_notas'),
      connection.raw('AVG(valor) as media_geral'),
      connection.raw('MAX(valor) as maior_nota'),
      connection.raw('MIN(valor) as menor_nota'),
      connection.raw('COUNT(CASE WHEN valor >= 6.0 THEN 1 END) as notas_aprovadas'),
      connection.raw('COUNT(CASE WHEN valor < 6.0 THEN 1 END) as notas_reprovadas')
    )
    .where({ matricula_aluno_id })
    .first();

  return stats;
};

// Buscar estatísticas de notas por aluno e período letivo
export const estatisticasPorAlunoPeriodo = async (matricula_aluno_id: string, periodo_letivo_id: string): Promise<any> => {
  const stats = await connection(tabela)
    .select(
      connection.raw('COUNT(*) as total_notas'),
      connection.raw('AVG(nota.valor) as media_geral'),
      connection.raw('MAX(nota.valor) as maior_nota'),
      connection.raw('MIN(nota.valor) as menor_nota'),
      connection.raw('COUNT(CASE WHEN nota.valor >= 6.0 THEN 1 END) as notas_aprovadas'),
      connection.raw('COUNT(CASE WHEN nota.valor < 6.0 THEN 1 END) as notas_reprovadas'),
      'periodo_letivo.bimestre'
    )
    .leftJoin('atividade', 'nota.atividade_id', 'atividade.atividade_id')
    .leftJoin('periodo_letivo', 'atividade.periodo_letivo_id', 'periodo_letivo.periodo_letivo_id')
    .where('nota.matricula_aluno_id', matricula_aluno_id)
    .where('atividade.periodo_letivo_id', periodo_letivo_id)
    .first();

  return stats;
};

// Buscar notas por período letivo
export const buscarPorPeriodo = async (periodo_letivo_id: string): Promise<any[]> => {
  return await connection(tabela)
    .select(
      'nota.*',
      'atividade.titulo as atividade_titulo',
      'atividade.peso as atividade_peso',
      'periodo_letivo.bimestre',
      'matricula_aluno.ra',
      'aluno.nome_aluno',
      'aluno.sobrenome_aluno'
    )
    .leftJoin('atividade', 'nota.atividade_id', 'atividade.atividade_id')
    .leftJoin('periodo_letivo', 'atividade.periodo_letivo_id', 'periodo_letivo.periodo_letivo_id')
    .leftJoin('matricula_aluno', 'nota.matricula_aluno_id', 'matricula_aluno.matricula_aluno_id')
    .leftJoin('aluno', 'matricula_aluno.aluno_id', 'aluno.aluno_id')
    .where('atividade.periodo_letivo_id', periodo_letivo_id)
    .orderBy('aluno.nome_aluno', 'asc')
    .orderBy('atividade.titulo', 'asc');
};

export const criar = async (nota: Omit<Nota, 'nota_id'>): Promise<Nota> => {
  // Verificar se a atividade existe e vale nota
  const atividade = await connection('atividade')
    .where({ atividade_id: nota.atividade_id })
    .first();

  if (!atividade) {
    throw new Error('Atividade não encontrada');
  }

  if (!atividade.vale_nota) {
    throw new Error('Esta atividade não vale nota');
  }

  // Verificar se a matrícula do aluno existe e está ativa
  const matricula = await connection('matricula_aluno')
    .where({ matricula_aluno_id: nota.matricula_aluno_id })
    .first();

  if (!matricula) {
    throw new Error('Matrícula do aluno não encontrada');
  }

  if (matricula.status !== 'ativo') {
    throw new Error('Aluno não está com matrícula ativa');
  }

  // Verificar se já existe nota para este aluno nesta atividade
  const notaExistente = await buscarPorAlunoEAtividade(nota.matricula_aluno_id, nota.atividade_id);
  if (notaExistente) {
    throw new Error('Já existe nota para este aluno nesta atividade. Use PUT para atualizar.');
  }

  // Validar valor da nota (0 a 10)
  if (nota.valor < 0 || nota.valor > 10) {
    throw new Error('Valor da nota deve estar entre 0 e 10');
  }

  const [novaNota] = await connection(tabela)
    .insert({
      ...nota,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return novaNota;
};

export const atualizar = async (
  nota_id: string,
  dadosAtualizacao: Partial<Omit<Nota, 'nota_id'>>
): Promise<Nota | undefined> => {
  // Validar valor da nota se estiver sendo atualizado
  if (dadosAtualizacao.valor !== undefined && (dadosAtualizacao.valor < 0 || dadosAtualizacao.valor > 10)) {
    throw new Error('Valor da nota deve estar entre 0 e 10');
  }

  const [notaAtualizada] = await connection(tabela)
    .where({ nota_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date()
    })
    .returning('*');

  return notaAtualizada;
};

export const deletar = async (nota_id: string): Promise<boolean> => {
  const linhasAfetadas = await connection(tabela)
    .where({ nota_id })
    .del();

  return linhasAfetadas > 0;
};

// Lançar notas em lote para uma atividade
export const lancarNotasLote = async (
  atividade_id: string,
  notas: Array<{ matricula_aluno_id: string; valor: number }>
): Promise<Nota[]> => {
  // Verificar se a atividade existe e vale nota
  const atividade = await connection('atividade')
    .where({ atividade_id })
    .first();

  if (!atividade) {
    throw new Error('Atividade não encontrada');
  }

  if (!atividade.vale_nota) {
    throw new Error('Esta atividade não vale nota');
  }

  // Verificar se todas as matrículas existem e estão ativas
  const matriculasIds = notas.map(n => n.matricula_aluno_id);
  const matriculas = await connection('matricula_aluno')
    .whereIn('matricula_aluno_id', matriculasIds)
    .where('status', 'ativo');

  if (matriculas.length !== matriculasIds.length) {
    throw new Error('Uma ou mais matrículas não foram encontradas ou estão inativas');
  }

  // Verificar se já existem notas para esta atividade
  const notasExistentes = await connection(tabela)
    .where({ atividade_id })
    .whereIn('matricula_aluno_id', matriculasIds);

  if (notasExistentes.length > 0) {
    throw new Error('Já existem notas registradas para alguns alunos nesta atividade. Use PUT para atualizar.');
  }

  // Validar valores das notas (0 a 10)
  for (const nota of notas) {
    if (nota.valor < 0 || nota.valor > 10) {
      throw new Error(`Valor da nota deve estar entre 0 e 10. Valor recebido: ${nota.valor}`);
    }
  }

  // Preparar dados para inserção
  const dadosNotas = notas.map(nota => ({
    atividade_id,
    matricula_aluno_id: nota.matricula_aluno_id,
    valor: nota.valor,
    created_at: new Date(),
    updated_at: new Date()
  }));

  // Inserir todas as notas em uma transação
  const notasInseridas = await connection(tabela)
    .insert(dadosNotas)
    .returning('*');

  return notasInseridas;
};