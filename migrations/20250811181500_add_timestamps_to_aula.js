/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('aula', function(table) {
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Adicionar índices para performance
    table.index(['turma_disciplina_professor_id'], 'idx_aula_vinculacao');
    table.index(['data_aula'], 'idx_aula_data');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('aula', function(table) {
    table.dropIndex(['turma_disciplina_professor_id'], 'idx_aula_vinculacao');
    table.dropIndex(['data_aula'], 'idx_aula_data');
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
