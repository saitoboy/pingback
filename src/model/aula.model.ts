import connection from '../connection';
import { Aula } from '../types/models';

const tabela = 'aula';

export const listarTodas = async (): Promise<Aula[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('data_aula', 'desc')
    .orderBy('hora_inicio', 'asc');
};

export const buscarPorId = async (aula_id: string): Promise<Aula | undefined> => {
  return await connection(tabela)
    .where({ aula_id })
    .first();
};

export const buscarPorVinculacao = async (turma_disciplina_professor_id: string): Promise<Aula[]> => {
  return await connection(tabela)
    .where({ turma_disciplina_professor_id })
    .orderBy('data_aula', 'desc')
    .orderBy('hora_inicio', 'asc');
};

export const buscarPorData = async (data_aula: string): Promise<Aula[]> => {
  return await connection(tabela)
    .whereRaw('DATE(data_aula) = ?', [data_aula])
    .orderBy('hora_inicio', 'asc');
};

export const criar = async (
  aula: Omit<Aula, 'aula_id' | 'created_at' | 'updated_at'>
): Promise<Aula> => {
  // Verificar se a vinculação existe
  const vinculacaoExiste = await connection('turma_disciplina_professor')
    .where({ turma_disciplina_professor_id: aula.turma_disciplina_professor_id })
    .first();

  if (!vinculacaoExiste) {
    throw new Error('Vinculação professor-turma-disciplina não encontrada');
  }

  // Verificar conflito de horário (mesma vinculação, mesma data, horários sobrepostos)
  const conflito = await connection(tabela)
    .where({ 
      turma_disciplina_professor_id: aula.turma_disciplina_professor_id,
    })
    .whereRaw('DATE(data_aula) = DATE(?)', [aula.data_aula])
    .where(function() {
      this.where(function() {
        // Nova aula começa durante uma aula existente
        this.where('hora_inicio', '<=', aula.hora_inicio)
            .where('hora_fim', '>', aula.hora_inicio);
      }).orWhere(function() {
        // Nova aula termina durante uma aula existente
        this.where('hora_inicio', '<', aula.hora_fim)
            .where('hora_fim', '>=', aula.hora_fim);
      }).orWhere(function() {
        // Nova aula engloba uma aula existente
        this.where('hora_inicio', '>=', aula.hora_inicio)
            .where('hora_fim', '<=', aula.hora_fim);
      });
    })
    .first();

  if (conflito) {
    throw new Error(`Conflito de horário: já existe aula das ${conflito.hora_inicio} às ${conflito.hora_fim} nesta data`);
  }

  const [novaAula] = await connection(tabela)
    .insert({
      ...aula,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return novaAula;
};

export const atualizar = async (
  aula_id: string,
  dadosAtualizacao: Partial<Omit<Aula, 'aula_id' | 'turma_disciplina_professor_id' | 'created_at' | 'updated_at'>>
): Promise<Aula | undefined> => {
  // Se está alterando horário ou data, verificar conflitos
  if (dadosAtualizacao.data_aula || dadosAtualizacao.hora_inicio || dadosAtualizacao.hora_fim) {
    const aulaAtual = await buscarPorId(aula_id);
    if (!aulaAtual) {
      throw new Error('Aula não encontrada');
    }

    const novaData = dadosAtualizacao.data_aula || aulaAtual.data_aula;
    const novaHoraInicio = dadosAtualizacao.hora_inicio || aulaAtual.hora_inicio;
    const novaHoraFim = dadosAtualizacao.hora_fim || aulaAtual.hora_fim;

    const conflito = await connection(tabela)
      .where({ 
        turma_disciplina_professor_id: aulaAtual.turma_disciplina_professor_id,
      })
      .whereNot('aula_id', aula_id) // Excluir a própria aula
      .whereRaw('DATE(data_aula) = DATE(?)', [novaData])
      .where(function() {
        this.where(function() {
          this.where('hora_inicio', '<=', novaHoraInicio)
              .where('hora_fim', '>', novaHoraInicio);
        }).orWhere(function() {
          this.where('hora_inicio', '<', novaHoraFim)
              .where('hora_fim', '>=', novaHoraFim);
        }).orWhere(function() {
          this.where('hora_inicio', '>=', novaHoraInicio)
              .where('hora_fim', '<=', novaHoraFim);
        });
      })
      .first();

    if (conflito) {
      throw new Error(`Conflito de horário: já existe aula das ${conflito.hora_inicio} às ${conflito.hora_fim} nesta data`);
    }
  }

  const [aulaAtualizada] = await connection(tabela)
    .where({ aula_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date()
    })
    .returning('*');

  return aulaAtualizada;
};

export const deletar = async (aula_id: string): Promise<boolean> => {
  // Verificar se há conteúdos vinculados
  const conteudosVinculados = await connection('conteudo_aula')
    .where({ aula_id })
    .first();

  if (conteudosVinculados) {
    throw new Error('Não é possível excluir aula que possui conteúdos registrados');
  }

  const deletados = await connection(tabela)
    .where({ aula_id })
    .del();

  return deletados > 0;
};

// Buscar aulas com detalhes da vinculação
export const buscarComDetalhes = async (aula_id?: string): Promise<any> => {
  let query = connection(tabela)
    .select(
      'a.*',
      't.nome_turma',
      't.turno',
      't.sala',
      's.nome_serie',
      'al.ano',
      'd.disciplina_id',
      'd.nome_disciplina',
      'p.professor_id',
      'u.nome_usuario as nome_professor',
      'u.email_usuario as email_professor'
    )
    .from(`${tabela} as a`)
    .join('turma_disciplina_professor as tdp', 'a.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('turma as t', 'tdp.turma_id', 't.turma_id')
    .join('serie as s', 't.serie_id', 's.serie_id')
    .join('ano_letivo as al', 't.ano_letivo_id', 'al.ano_letivo_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .join('professor as p', 'tdp.professor_id', 'p.professor_id')
    .join('usuario as u', 'p.usuario_id', 'u.usuario_id')
    .orderBy('a.data_aula', 'desc')
    .orderBy('a.hora_inicio', 'asc');

  if (aula_id) {
    return await query.where('a.aula_id', aula_id).first();
  }

  return await query;
};

// Buscar detalhes de uma aula específica de forma mais robusta
export const buscarDetalhesAula = async (aula_id: string): Promise<any> => {
  try {
    // 1. Buscar dados básicos da aula
    const aula = await connection(tabela)
      .where('aula_id', aula_id)
      .first();

    if (!aula) {
      return null;
    }

    // 2. Buscar dados da vinculação
    const vinculacao = await connection('turma_disciplina_professor as tdp')
      .select(
        'tdp.*',
        't.turma_id',
        't.nome_turma',
        't.turno',
        't.sala',
        's.nome_serie',
        'al.ano',
        'd.disciplina_id',
        'd.nome_disciplina',
        'p.professor_id',
        'u.nome_usuario as nome_professor',
        'u.email_usuario as email_professor'
      )
      .join('turma as t', 'tdp.turma_id', 't.turma_id')
      .join('serie as s', 't.serie_id', 's.serie_id')
      .join('ano_letivo as al', 't.ano_letivo_id', 'al.ano_letivo_id')
      .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
      .join('professor as p', 'tdp.professor_id', 'p.professor_id')
      .join('usuario as u', 'p.usuario_id', 'u.usuario_id')
      .where('tdp.turma_disciplina_professor_id', aula.turma_disciplina_professor_id)
      .first();

    if (!vinculacao) {
      return aula; // Retorna apenas os dados da aula se não encontrar vinculação
    }

    // 3. Combinar todos os dados
    return {
      ...aula,
      turma_id: vinculacao.turma_id,
      nome_turma: vinculacao.nome_turma,
      turno: vinculacao.turno,
      sala: vinculacao.sala,
      nome_serie: vinculacao.nome_serie,
      ano: vinculacao.ano,
      disciplina_id: vinculacao.disciplina_id,
      nome_disciplina: vinculacao.nome_disciplina,
      professor_id: vinculacao.professor_id,
      nome_professor: vinculacao.nome_professor,
      email_professor: vinculacao.email_professor
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes da aula:', error);
    throw error;
  }
};

// Verificar se um professor tem acesso a uma aula (é o professor responsável)
export const verificarAcessoProfessor = async (aula_id: string, professor_id: string): Promise<boolean> => {
  const aula = await connection(tabela)
    .select('a.aula_id')
    .from(`${tabela} as a`)
    .join('turma_disciplina_professor as tdp', 'a.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .where('a.aula_id', aula_id)
    .where('tdp.professor_id', professor_id)
    .first();

  return !!aula;
};
