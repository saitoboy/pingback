/**
 * Migração: Modificar frequência para usar professor_id + turma_id + data_aula
 * 
 * A frequência agora será contada por dia de aula do professor na turma,
 * não mais por matéria/disciplina.
 */

exports.up = async function(knex) {
  console.log('🔄 Iniciando migração: Modificar frequência para professor + turma + data');
  
  // 1. Adicionar colunas professor_id e turma_id se não existirem
  const hasProfessorId = await knex.schema.hasColumn('frequencia', 'professor_id');
  const hasTurmaId = await knex.schema.hasColumn('frequencia', 'turma_id');
  
  if (!hasProfessorId) {
    await knex.schema.alterTable('frequencia', function(table) {
      table.uuid('professor_id').nullable();
    });
    console.log('✅ Coluna professor_id adicionada');
  }
  
  if (!hasTurmaId) {
    await knex.schema.alterTable('frequencia', function(table) {
      table.uuid('turma_id').nullable();
    });
    console.log('✅ Coluna turma_id adicionada');
  }
  
  // 2. Migrar dados existentes: preencher professor_id e turma_id a partir de turma_disciplina_professor_id
  console.log('🔄 Migrando dados existentes...');
  
  const frequencias = await knex('frequencia')
    .select('frequencia.frequencia_id', 'frequencia.turma_disciplina_professor_id', 'frequencia.data_aula')
    .whereNotNull('turma_disciplina_professor_id');
  
  for (const freq of frequencias) {
    // Buscar professor_id e turma_id da vinculação
    const vinculacao = await knex('turma_disciplina_professor')
      .select('professor_id', 'turma_id')
      .where('turma_disciplina_professor_id', freq.turma_disciplina_professor_id)
      .first();
    
    if (vinculacao) {
      await knex('frequencia')
        .where('frequencia_id', freq.frequencia_id)
        .update({
          professor_id: vinculacao.professor_id,
          turma_id: vinculacao.turma_id
        });
    }
  }
  
  // Também migrar frequências que têm aula_id mas não têm turma_disciplina_professor_id
  const frequenciasComAula = await knex('frequencia')
    .select('frequencia.frequencia_id', 'frequencia.aula_id')
    .whereNotNull('aula_id')
    .whereNull('turma_disciplina_professor_id');
  
  for (const freq of frequenciasComAula) {
    const aula = await knex('aula')
      .select('turma_disciplina_professor_id', 'data_aula')
      .where('aula_id', freq.aula_id)
      .first();
    
    if (aula) {
      const vinculacao = await knex('turma_disciplina_professor')
        .select('professor_id', 'turma_id')
        .where('turma_disciplina_professor_id', aula.turma_disciplina_professor_id)
        .first();
      
      if (vinculacao) {
        await knex('frequencia')
          .where('frequencia_id', freq.frequencia_id)
          .update({
            professor_id: vinculacao.professor_id,
            turma_id: vinculacao.turma_id,
            data_aula: aula.data_aula,
            turma_disciplina_professor_id: aula.turma_disciplina_professor_id
          });
      }
    }
  }
  
  console.log(`✅ ${frequencias.length + frequenciasComAula.length} frequências migradas`);
  
  // 3. Verificar se data_aula existe antes de alterar a tabela
  const hasDataAula = await knex.schema.hasColumn('frequencia', 'data_aula');
  
  // 4. Tornar professor_id e turma_id obrigatórios e remover turma_disciplina_professor_id
  await knex.schema.alterTable('frequencia', function(table) {
    // Remover constraint de unicidade antiga se existir
    table.dropUnique(['aula_id', 'matricula_aluno_id']).catch(() => {});
    table.dropUnique(['turma_disciplina_professor_id', 'matricula_aluno_id', 'data_aula']).catch(() => {});
    
    // Tornar professor_id e turma_id obrigatórios
    table.uuid('professor_id').notNullable().alter();
    table.uuid('turma_id').notNullable().alter();
    
    // Remover coluna turma_disciplina_professor_id (não é mais necessária)
    table.dropColumn('turma_disciplina_professor_id');
    
    // Tornar aula_id opcional (pode ser null)
    table.uuid('aula_id').nullable().alter();
    
    // Garantir que data_aula existe e não é nula
    if (!hasDataAula) {
      table.date('data_aula').notNullable();
    } else {
      table.date('data_aula').notNullable().alter();
    }
    
    // Adicionar foreign keys
    // IMPORTANTE: professor_id na tabela frequencia armazena usuario_id, não professor_id da tabela professor
    table.foreign('professor_id').references('usuario_id').inTable('usuario').onDelete('CASCADE');
    table.foreign('turma_id').references('turma_id').inTable('turma').onDelete('CASCADE');
    
    // Nova constraint de unicidade: um aluno pode ter apenas uma frequência por professor + turma + data
    table.unique(['professor_id', 'turma_id', 'data_aula', 'matricula_aluno_id'], {
      indexName: 'frequencia_professor_turma_data_aluno_unique'
    });
  });
  
  // 5. Criar índices para melhor performance
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS frequencia_professor_id_idx ON frequencia(professor_id);
    CREATE INDEX IF NOT EXISTS frequencia_turma_id_idx ON frequencia(turma_id);
    CREATE INDEX IF NOT EXISTS frequencia_data_aula_idx ON frequencia(data_aula);
    CREATE INDEX IF NOT EXISTS frequencia_professor_turma_data_idx ON frequencia(professor_id, turma_id, data_aula);
  `);
  
  console.log('✅ Migração concluída com sucesso!');
};

exports.down = async function(knex) {
  console.log('🔄 Revertendo migração: Frequência para professor + turma + data');
  
  // 1. Adicionar coluna turma_disciplina_professor_id de volta
  const hasTurmaDisciplinaProfessorId = await knex.schema.hasColumn('frequencia', 'turma_disciplina_professor_id');
  
  if (!hasTurmaDisciplinaProfessorId) {
    await knex.schema.alterTable('frequencia', function(table) {
      table.uuid('turma_disciplina_professor_id').nullable();
    });
  }
  
  // 2. Migrar dados de volta: buscar turma_disciplina_professor_id a partir de professor_id + turma_id
  const frequencias = await knex('frequencia')
    .select('frequencia_id', 'professor_id', 'turma_id')
    .whereNotNull('professor_id')
    .whereNotNull('turma_id');
  
  for (const freq of frequencias) {
    // Buscar uma vinculação que corresponda ao professor e turma
    const vinculacao = await knex('turma_disciplina_professor')
      .select('turma_disciplina_professor_id')
      .where('professor_id', freq.professor_id)
      .where('turma_id', freq.turma_id)
      .first();
    
    if (vinculacao) {
      await knex('frequencia')
        .where('frequencia_id', freq.frequencia_id)
        .update({
          turma_disciplina_professor_id: vinculacao.turma_disciplina_professor_id
        });
    }
  }
  
  // 3. Remover índices
  await knex.raw(`
    DROP INDEX IF EXISTS frequencia_professor_id_idx;
    DROP INDEX IF EXISTS frequencia_turma_id_idx;
    DROP INDEX IF EXISTS frequencia_data_aula_idx;
    DROP INDEX IF EXISTS frequencia_professor_turma_data_idx;
  `);
  
  // 4. Reverter alterações na tabela
  await knex.schema.alterTable('frequencia', function(table) {
    // Remover constraint de unicidade nova
    table.dropUnique(['professor_id', 'turma_id', 'data_aula', 'matricula_aluno_id']).catch(() => {});
    
    // Remover foreign keys
    table.dropForeign('professor_id').catch(() => {});
    table.dropForeign('turma_id').catch(() => {});
    
    // Remover colunas professor_id e turma_id
    table.dropColumn('professor_id');
    table.dropColumn('turma_id');
    
    // Restaurar constraint antiga
    table.unique(['aula_id', 'matricula_aluno_id']).catch(() => {});
  });
  
  console.log('✅ Reversão concluída');
};

