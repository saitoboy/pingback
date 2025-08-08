/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('turma_disciplina_professor', function(table) {
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Adicionar índices para performance
    table.index(['turma_id', 'disciplina_id'], 'idx_turma_disciplina');
    table.index(['professor_id'], 'idx_professor_vinculacao');
    table.index(['turma_id'], 'idx_turma_vinculacao');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('turma_disciplina_professor', function(table) {
    table.dropIndex(['turma_id', 'disciplina_id'], 'idx_turma_disciplina');
    table.dropIndex(['professor_id'], 'idx_professor_vinculacao');
    table.dropIndex(['turma_id'], 'idx_turma_vinculacao');
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
