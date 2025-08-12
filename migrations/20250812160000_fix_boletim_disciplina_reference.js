exports.up = function(knex) {
  return knex.schema.alterTable('boletim_disciplina', function(table) {
    // Remover a foreign key e coluna disciplina_id
    table.dropForeign(['disciplina_id']);
    table.dropColumn('disciplina_id');
    
    // Adicionar turma_disciplina_professor_id
    table.uuid('turma_disciplina_professor_id').notNullable();
    table.foreign('turma_disciplina_professor_id').references('turma_disciplina_professor_id').inTable('turma_disciplina_professor').onDelete('CASCADE');
    
    // Adicionar novo índice
    table.index(['turma_disciplina_professor_id'], 'idx_boletim_disciplina_turma_disc_prof');
    
    // Adicionar nova constraint de unicidade
    table.unique(['boletim_id', 'turma_disciplina_professor_id'], 'uk_boletim_disciplina_boletim_tdp');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('boletim_disciplina', function(table) {
    // Reverter constraint e índices
    table.dropUnique(['boletim_id', 'turma_disciplina_professor_id'], 'uk_boletim_disciplina_boletim_tdp');
    table.dropIndex(['turma_disciplina_professor_id'], 'idx_boletim_disciplina_turma_disc_prof');
    
    // Remover turma_disciplina_professor_id
    table.dropForeign(['turma_disciplina_professor_id']);
    table.dropColumn('turma_disciplina_professor_id');
    
    // Restaurar disciplina_id
    table.uuid('disciplina_id').notNullable();
    table.foreign('disciplina_id').references('disciplina_id').inTable('disciplina').onDelete('CASCADE');
  });
};
