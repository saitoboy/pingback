/**
 * Migration: Adiciona grade de horários do professor e modifica estrutura do diário
 * para trabalhar com registro por dia ao invés de por aula
 * 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // 1. Criar tabela de grade de horários do professor (se não existir)
  const hasTable = await knex.schema.hasTable('grade_horario_professor');
  
  if (!hasTable) {
    // Criar tabela sem a constraint de unicidade primeiro
    await knex.schema.createTable('grade_horario_professor', function(table) {
      table.uuid('grade_horario_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('turma_disciplina_professor_id').notNullable();
      table.integer('dia_semana').notNullable(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
      table.time('hora_inicio').notNullable();
      table.time('hora_fim').notNullable();
      table.timestamps(true, true);
      
      // Foreign keys
      table.foreign('turma_disciplina_professor_id')
        .references('turma_disciplina_professor_id')
        .inTable('turma_disciplina_professor')
        .onDelete('CASCADE');
      
      // Índices
      table.index('turma_disciplina_professor_id');
      table.index('dia_semana');
      table.index(['turma_disciplina_professor_id', 'dia_semana']);
    });
  }
  
  // Adicionar constraint de unicidade separadamente (usar nome mais curto para evitar truncamento)
  // Verificar se a tabela existe antes de adicionar constraint
  const tableExistsNow = await knex.schema.hasTable('grade_horario_professor');
  if (tableExistsNow) {
    try {
      // Usar nome mais curto para evitar truncamento do PostgreSQL (limite de 63 caracteres)
      await knex.raw(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'grade_horario_professor' 
            AND constraint_name LIKE 'grade_horario%unique'
          ) THEN
            ALTER TABLE grade_horario_professor 
            ADD CONSTRAINT grade_horario_unique 
            UNIQUE (turma_disciplina_professor_id, dia_semana, hora_inicio, hora_fim);
          END IF;
        EXCEPTION WHEN duplicate_table THEN
          -- Constraint já existe, ignorar
          NULL;
        END $$;
      `);
    } catch (error) {
      // Se der erro, a constraint provavelmente já existe - continuar
      console.log('Constraint já existe ou erro ao criar (ignorando):', error.message);
    }
  }

  // 2. Modificar tabela frequencia para usar data + turma_disciplina_professor_id
  // Verificar se as colunas já existem
  const hasDataAula = await knex.schema.hasColumn('frequencia', 'data_aula');
  const hasTurmaDisciplinaProfessorId = await knex.schema.hasColumn('frequencia', 'turma_disciplina_professor_id');
  
  if (!hasDataAula || !hasTurmaDisciplinaProfessorId) {
    await knex.schema.alterTable('frequencia', function(table) {
      // Adicionar novas colunas apenas se não existirem
      if (!hasDataAula) {
        table.date('data_aula').nullable();
      }
      if (!hasTurmaDisciplinaProfessorId) {
        table.uuid('turma_disciplina_professor_id').nullable();
      }
    });
    
    // Criar índices e foreign keys separadamente
    if (!hasDataAula) {
      await knex.schema.alterTable('frequencia', function(table) {
        table.index('data_aula');
      });
    }
    
    if (!hasTurmaDisciplinaProfessorId) {
      await knex.schema.alterTable('frequencia', function(table) {
        table.index('turma_disciplina_professor_id');
        table.foreign('turma_disciplina_professor_id')
          .references('turma_disciplina_professor_id')
          .inTable('turma_disciplina_professor')
          .onDelete('CASCADE');
      });
    }
    
    // Criar índice composto
    await knex.raw(`
      CREATE INDEX IF NOT EXISTS frequencia_turma_disciplina_professor_id_data_aula_idx 
      ON frequencia(turma_disciplina_professor_id, data_aula)
    `);
  }

  // Migrar dados existentes de frequencia (se houver)
  // Buscar todas as frequências e atualizar com data e turma_disciplina_professor_id da aula
  const frequencias = await knex('frequencia')
    .join('aula', 'frequencia.aula_id', 'aula.aula_id')
    .select('frequencia.frequencia_id', 'aula.data_aula', 'aula.turma_disciplina_professor_id');
  
  for (const freq of frequencias) {
    await knex('frequencia')
      .where('frequencia_id', freq.frequencia_id)
      .update({
        data_aula: freq.data_aula,
        turma_disciplina_professor_id: freq.turma_disciplina_professor_id
      });
  }

  // Migrar dados existentes de frequencia (se houver)
  // Buscar todas as frequências e atualizar com data e turma_disciplina_professor_id da aula
  if (hasDataAula && hasTurmaDisciplinaProfessorId) {
    // Se as colunas já existem, verificar se já têm dados
    const frequenciasSemData = await knex('frequencia')
      .whereNull('data_aula')
      .orWhereNull('turma_disciplina_professor_id')
      .join('aula', 'frequencia.aula_id', 'aula.aula_id')
      .select('frequencia.frequencia_id', 'aula.data_aula', 'aula.turma_disciplina_professor_id');
    
    for (const freq of frequenciasSemData) {
      await knex('frequencia')
        .where('frequencia_id', freq.frequencia_id)
        .update({
          data_aula: freq.data_aula,
          turma_disciplina_professor_id: freq.turma_disciplina_professor_id
        });
    }
  } else {
    // Se as colunas não existiam, migrar todos os dados
    const frequencias = await knex('frequencia')
      .join('aula', 'frequencia.aula_id', 'aula.aula_id')
      .select('frequencia.frequencia_id', 'aula.data_aula', 'aula.turma_disciplina_professor_id');
    
    for (const freq of frequencias) {
      await knex('frequencia')
        .where('frequencia_id', freq.frequencia_id)
        .update({
          data_aula: freq.data_aula,
          turma_disciplina_professor_id: freq.turma_disciplina_professor_id
        });
    }
    
    // Tornar as novas colunas obrigatórias após migração
    await knex.schema.alterTable('frequencia', function(table) {
      table.date('data_aula').notNullable().alter();
      table.uuid('turma_disciplina_professor_id').notNullable().alter();
    });
  }

  // Remover constraint de unicidade antiga e criar nova (se necessário)
  try {
    await knex.schema.alterTable('frequencia', function(table) {
      table.dropUnique(['aula_id', 'matricula_aluno_id']);
    });
  } catch (error) {
    // Constraint pode não existir
    console.log('Constraint antiga não existe ou já foi removida');
  }
  
  try {
    await knex.schema.alterTable('frequencia', function(table) {
      table.unique(['turma_disciplina_professor_id', 'data_aula', 'matricula_aluno_id']);
    });
  } catch (error) {
    // Constraint pode já existir
    console.log('Nova constraint já existe');
  }

  // Tornar aula_id nullable (para manter compatibilidade temporária)
  try {
    await knex.schema.alterTable('frequencia', function(table) {
      table.uuid('aula_id').nullable().alter();
    });
  } catch (error) {
    // Pode já estar nullable
    console.log('aula_id já é nullable ou erro ao alterar');
  }

  // 3. Modificar tabela atividade para adicionar data
  const hasAtividadeDataAula = await knex.schema.hasColumn('atividade', 'data_aula');
  
  if (!hasAtividadeDataAula) {
    await knex.schema.alterTable('atividade', function(table) {
      // Adicionar coluna data
      table.date('data_aula').nullable();
    });
    
    await knex.schema.alterTable('atividade', function(table) {
      table.index('data_aula');
    });
    
    await knex.raw(`
      CREATE INDEX IF NOT EXISTS atividade_turma_disciplina_professor_id_data_aula_idx 
      ON atividade(turma_disciplina_professor_id, data_aula)
    `);
  }

  // Migrar dados existentes de atividade (apenas se a coluna foi criada)
  if (!hasAtividadeDataAula) {
    const atividades = await knex('atividade')
      .join('aula', 'atividade.aula_id', 'aula.aula_id')
      .select('atividade.atividade_id', 'aula.data_aula')
      .whereNotNull('atividade.aula_id');
    
    for (const ativ of atividades) {
      await knex('atividade')
        .where('atividade_id', ativ.atividade_id)
        .update({ data_aula: ativ.data_aula });
    }
  } else {
    // Se a coluna já existe, migrar apenas os que não têm data
    const atividadesSemData = await knex('atividade')
      .whereNull('data_aula')
      .join('aula', 'atividade.aula_id', 'aula.aula_id')
      .select('atividade.atividade_id', 'aula.data_aula')
      .whereNotNull('atividade.aula_id');
    
    for (const ativ of atividadesSemData) {
      await knex('atividade')
        .where('atividade_id', ativ.atividade_id)
        .update({ data_aula: ativ.data_aula });
    }
  }

  // 4. Modificar tabela conteudo_aula para usar data + turma_disciplina_professor_id
  const hasConteudoDataAula = await knex.schema.hasColumn('conteudo_aula', 'data_aula');
  const hasConteudoTurmaDisciplinaProfessorId = await knex.schema.hasColumn('conteudo_aula', 'turma_disciplina_professor_id');
  
  if (!hasConteudoDataAula || !hasConteudoTurmaDisciplinaProfessorId) {
    await knex.schema.alterTable('conteudo_aula', function(table) {
      // Adicionar novas colunas apenas se não existirem
      if (!hasConteudoDataAula) {
        table.date('data_aula').nullable();
      }
      if (!hasConteudoTurmaDisciplinaProfessorId) {
        table.uuid('turma_disciplina_professor_id').nullable();
      }
    });
    
    // Criar índices e foreign keys separadamente
    if (!hasConteudoDataAula) {
      await knex.schema.alterTable('conteudo_aula', function(table) {
        table.index('data_aula');
      });
    }
    
    if (!hasConteudoTurmaDisciplinaProfessorId) {
      await knex.schema.alterTable('conteudo_aula', function(table) {
        table.index('turma_disciplina_professor_id');
        table.foreign('turma_disciplina_professor_id')
          .references('turma_disciplina_professor_id')
          .inTable('turma_disciplina_professor')
          .onDelete('CASCADE');
      });
    }
    
    // Criar índice composto
    await knex.raw(`
      CREATE INDEX IF NOT EXISTS conteudo_aula_turma_disciplina_professor_id_data_aula_idx 
      ON conteudo_aula(turma_disciplina_professor_id, data_aula)
    `);
  }

  // Migrar dados existentes de conteudo_aula
  if (!hasConteudoDataAula || !hasConteudoTurmaDisciplinaProfessorId) {
    const conteudos = await knex('conteudo_aula')
      .join('aula', 'conteudo_aula.aula_id', 'aula.aula_id')
      .select('conteudo_aula.conteudo_aula_id', 'aula.data_aula', 'aula.turma_disciplina_professor_id');
    
    for (const conteudo of conteudos) {
      await knex('conteudo_aula')
        .where('conteudo_aula_id', conteudo.conteudo_aula_id)
        .update({
          data_aula: conteudo.data_aula,
          turma_disciplina_professor_id: conteudo.turma_disciplina_professor_id
        });
    }
    
    // Tornar as novas colunas obrigatórias após migração
    try {
      await knex.schema.alterTable('conteudo_aula', function(table) {
        table.date('data_aula').notNullable().alter();
        table.uuid('turma_disciplina_professor_id').notNullable().alter();
      });
    } catch (error) {
      console.log('Erro ao tornar colunas obrigatórias:', error.message);
    }
  } else {
    // Se as colunas já existem, migrar apenas os que não têm dados
    const conteudosSemData = await knex('conteudo_aula')
      .whereNull('data_aula')
      .orWhereNull('turma_disciplina_professor_id')
      .join('aula', 'conteudo_aula.aula_id', 'aula.aula_id')
      .select('conteudo_aula.conteudo_aula_id', 'aula.data_aula', 'aula.turma_disciplina_professor_id');
    
    for (const conteudo of conteudosSemData) {
      await knex('conteudo_aula')
        .where('conteudo_aula_id', conteudo.conteudo_aula_id)
        .update({
          data_aula: conteudo.data_aula,
          turma_disciplina_professor_id: conteudo.turma_disciplina_professor_id
        });
    }
  }

  // Tornar aula_id nullable
  try {
    await knex.schema.alterTable('conteudo_aula', function(table) {
      table.uuid('aula_id').nullable().alter();
    });
  } catch (error) {
    // Pode já estar nullable
    console.log('aula_id já é nullable ou erro ao alterar');
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Reverter alterações na tabela conteudo_aula
  await knex.schema.alterTable('conteudo_aula', function(table) {
    table.uuid('aula_id').notNullable().alter();
    table.dropForeign('turma_disciplina_professor_id');
    table.dropIndex(['turma_disciplina_professor_id', 'data_aula']);
    table.dropIndex('turma_disciplina_professor_id');
    table.dropIndex('data_aula');
    table.dropColumn('turma_disciplina_professor_id');
    table.dropColumn('data_aula');
  });

  // Reverter alterações na tabela atividade
  await knex.schema.alterTable('atividade', function(table) {
    table.dropIndex(['turma_disciplina_professor_id', 'data_aula']);
    table.dropIndex('data_aula');
    table.dropColumn('data_aula');
  });

  // Reverter alterações na tabela frequencia
  await knex.schema.alterTable('frequencia', function(table) {
    table.uuid('aula_id').notNullable().alter();
    table.dropUnique(['turma_disciplina_professor_id', 'data_aula', 'matricula_aluno_id']);
    table.unique(['aula_id', 'matricula_aluno_id']);
    table.dropForeign('turma_disciplina_professor_id');
    table.dropIndex(['turma_disciplina_professor_id', 'data_aula']);
    table.dropIndex('turma_disciplina_professor_id');
    table.dropIndex('data_aula');
    table.dropColumn('turma_disciplina_professor_id');
    table.dropColumn('data_aula');
  });

  // Remover tabela grade_horario_professor
  await knex.schema.dropTableIfExists('grade_horario_professor');
};

