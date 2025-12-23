import connection from '../connection';

export interface GradeHorarioProfessor {
  grade_horario_id: string;
  turma_disciplina_professor_id: string;
  dia_semana: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  hora_inicio: string;
  hora_fim: string;
  created_at: Date;
  updated_at: Date;
}

const tabela = 'grade_horario_professor';

export const listarTodas = async (): Promise<GradeHorarioProfessor[]> => {
  return await connection(tabela)
    .select('*')
    .orderBy('dia_semana', 'asc')
    .orderBy('hora_inicio', 'asc');
};

export const buscarPorId = async (grade_horario_id: string): Promise<GradeHorarioProfessor | undefined> => {
  return await connection(tabela)
    .where({ grade_horario_id })
    .first();
};

export const buscarPorVinculacao = async (turma_disciplina_professor_id: string): Promise<GradeHorarioProfessor[]> => {
  return await connection(tabela)
    .where({ turma_disciplina_professor_id })
    .orderBy('dia_semana', 'asc')
    .orderBy('hora_inicio', 'asc');
};

export const buscarPorProfessor = async (professor_id: string): Promise<GradeHorarioProfessor[]> => {
  return await connection(tabela)
    .select('gh.*')
    .from(`${tabela} as gh`)
    .join('turma_disciplina_professor as tdp', 'gh.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .where('tdp.professor_id', professor_id)
    .orderBy('gh.dia_semana', 'asc')
    .orderBy('gh.hora_inicio', 'asc');
};

export const buscarPorDiaSemana = async (
  turma_disciplina_professor_id: string,
  dia_semana: number
): Promise<GradeHorarioProfessor[]> => {
  return await connection(tabela)
    .where({ turma_disciplina_professor_id, dia_semana })
    .orderBy('hora_inicio', 'asc');
};

export const criar = async (
  grade: Omit<GradeHorarioProfessor, 'grade_horario_id' | 'created_at' | 'updated_at'>
): Promise<GradeHorarioProfessor> => {
  // Verificar se a vinculação existe
  const vinculacaoExiste = await connection('turma_disciplina_professor')
    .where({ turma_disciplina_professor_id: grade.turma_disciplina_professor_id })
    .first();

  if (!vinculacaoExiste) {
    throw new Error('Vinculação professor-turma-disciplina não encontrada');
  }

  // Validar dia da semana (0-6)
  if (grade.dia_semana < 0 || grade.dia_semana > 6) {
    throw new Error('Dia da semana deve estar entre 0 (Domingo) e 6 (Sábado)');
  }

  // Validar horários
  if (grade.hora_inicio >= grade.hora_fim) {
    throw new Error('Hora de início deve ser anterior à hora de fim');
  }

  // Verificar conflito de horário (mesma vinculação, mesmo dia, horários sobrepostos)
  const conflito = await connection(tabela)
    .where({ 
      turma_disciplina_professor_id: grade.turma_disciplina_professor_id,
      dia_semana: grade.dia_semana
    })
    .where(function() {
      this.where(function() {
        // Nova grade começa durante uma grade existente
        this.where('hora_inicio', '<=', grade.hora_inicio)
            .where('hora_fim', '>', grade.hora_inicio);
      }).orWhere(function() {
        // Nova grade termina durante uma grade existente
        this.where('hora_inicio', '<', grade.hora_fim)
            .where('hora_fim', '>=', grade.hora_fim);
      }).orWhere(function() {
        // Nova grade engloba uma grade existente
        this.where('hora_inicio', '>=', grade.hora_inicio)
            .where('hora_fim', '<=', grade.hora_fim);
      });
    })
    .first();

  if (conflito) {
    throw new Error(`Conflito de horário: já existe grade das ${conflito.hora_inicio} às ${conflito.hora_fim} neste dia`);
  }

  const [novaGrade] = await connection(tabela)
    .insert({
      ...grade,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return novaGrade;
};

export const criarEmLote = async (
  grades: Array<Omit<GradeHorarioProfessor, 'grade_horario_id' | 'created_at' | 'updated_at'>>
): Promise<GradeHorarioProfessor[]> => {
  const now = new Date();
  const gradesInseridas: GradeHorarioProfessor[] = [];

  for (const grade of grades) {
    // Validar cada grade antes de inserir
    const vinculacaoExiste = await connection('turma_disciplina_professor')
      .where({ turma_disciplina_professor_id: grade.turma_disciplina_professor_id })
      .first();

    if (!vinculacaoExiste) {
      throw new Error(`Vinculação ${grade.turma_disciplina_professor_id} não encontrada`);
    }

    if (grade.dia_semana < 0 || grade.dia_semana > 6) {
      throw new Error('Dia da semana deve estar entre 0 (Domingo) e 6 (Sábado)');
    }

    if (grade.hora_inicio >= grade.hora_fim) {
      throw new Error('Hora de início deve ser anterior à hora de fim');
    }

    // Verificar conflitos com outras grades do mesmo lote
    const conflitoLote = gradesInseridas.find(g => 
      g.turma_disciplina_professor_id === grade.turma_disciplina_professor_id &&
      g.dia_semana === grade.dia_semana &&
      (
        (g.hora_inicio <= grade.hora_inicio && g.hora_fim > grade.hora_inicio) ||
        (g.hora_inicio < grade.hora_fim && g.hora_fim >= grade.hora_fim) ||
        (g.hora_inicio >= grade.hora_inicio && g.hora_fim <= grade.hora_fim)
      )
    );

    if (conflitoLote) {
      throw new Error(`Conflito de horário no lote: grade das ${grade.hora_inicio} às ${grade.hora_fim} conflita com outra grade do mesmo dia`);
    }

    // Verificar conflitos com grades existentes
    const conflito = await connection(tabela)
      .where({ 
        turma_disciplina_professor_id: grade.turma_disciplina_professor_id,
        dia_semana: grade.dia_semana
      })
      .where(function() {
        this.where(function() {
          this.where('hora_inicio', '<=', grade.hora_inicio)
              .where('hora_fim', '>', grade.hora_inicio);
        }).orWhere(function() {
          this.where('hora_inicio', '<', grade.hora_fim)
              .where('hora_fim', '>=', grade.hora_fim);
        }).orWhere(function() {
          this.where('hora_inicio', '>=', grade.hora_inicio)
              .where('hora_fim', '<=', grade.hora_fim);
        });
      })
      .first();

    if (conflito) {
      throw new Error(`Conflito de horário: já existe grade das ${conflito.hora_inicio} às ${conflito.hora_fim} neste dia`);
    }

    const [novaGrade] = await connection(tabela)
      .insert({
        ...grade,
        created_at: now,
        updated_at: now
      })
      .returning('*');

    gradesInseridas.push(novaGrade);
  }

  return gradesInseridas;
};

export const atualizar = async (
  grade_horario_id: string,
  dadosAtualizacao: Partial<Omit<GradeHorarioProfessor, 'grade_horario_id' | 'created_at' | 'updated_at'>>
): Promise<GradeHorarioProfessor | undefined> => {
  // Se está alterando horário ou dia, verificar conflitos
  if (dadosAtualizacao.dia_semana !== undefined || dadosAtualizacao.hora_inicio || dadosAtualizacao.hora_fim) {
    const gradeAtual = await buscarPorId(grade_horario_id);
    if (!gradeAtual) {
      throw new Error('Grade de horário não encontrada');
    }

    const novoDia = dadosAtualizacao.dia_semana !== undefined ? dadosAtualizacao.dia_semana : gradeAtual.dia_semana;
    const novaHoraInicio = dadosAtualizacao.hora_inicio || gradeAtual.hora_inicio;
    const novaHoraFim = dadosAtualizacao.hora_fim || gradeAtual.hora_fim;
    const novaVinculacao = dadosAtualizacao.turma_disciplina_professor_id || gradeAtual.turma_disciplina_professor_id;

    if (novaHoraInicio >= novaHoraFim) {
      throw new Error('Hora de início deve ser anterior à hora de fim');
    }

    const conflito = await connection(tabela)
      .where({ 
        turma_disciplina_professor_id: novaVinculacao,
        dia_semana: novoDia
      })
      .whereNot('grade_horario_id', grade_horario_id)
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
      throw new Error(`Conflito de horário: já existe grade das ${conflito.hora_inicio} às ${conflito.hora_fim} neste dia`);
    }
  }

  const [gradeAtualizada] = await connection(tabela)
    .where({ grade_horario_id })
    .update({
      ...dadosAtualizacao,
      updated_at: new Date()
    })
    .returning('*');

  return gradeAtualizada;
};

export const deletar = async (grade_horario_id: string): Promise<boolean> => {
  const deletados = await connection(tabela)
    .where({ grade_horario_id })
    .del();

  return deletados > 0;
};

export const deletarPorVinculacao = async (turma_disciplina_professor_id: string): Promise<boolean> => {
  const deletados = await connection(tabela)
    .where({ turma_disciplina_professor_id })
    .del();

  return deletados > 0;
};

// Buscar grade com detalhes da vinculação
export const buscarComDetalhes = async (grade_horario_id?: string): Promise<any> => {
  let query = connection(tabela)
    .select(
      'gh.*',
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
    .from(`${tabela} as gh`)
    .join('turma_disciplina_professor as tdp', 'gh.turma_disciplina_professor_id', 'tdp.turma_disciplina_professor_id')
    .join('turma as t', 'tdp.turma_id', 't.turma_id')
    .join('serie as s', 't.serie_id', 's.serie_id')
    .join('ano_letivo as al', 't.ano_letivo_id', 'al.ano_letivo_id')
    .join('disciplina as d', 'tdp.disciplina_id', 'd.disciplina_id')
    .join('professor as p', 'tdp.professor_id', 'p.professor_id')
    .join('usuario as u', 'p.usuario_id', 'u.usuario_id')
    .orderBy('gh.dia_semana', 'asc')
    .orderBy('gh.hora_inicio', 'asc');

  if (grade_horario_id) {
    return await query.where('gh.grade_horario_id', grade_horario_id).first();
  }

  return await query;
};

// Obter nome do dia da semana
export const obterNomeDiaSemana = (dia_semana: number): string => {
  const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return dias[dia_semana] || 'Dia inválido';
};

