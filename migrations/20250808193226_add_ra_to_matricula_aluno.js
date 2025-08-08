/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('matricula_aluno', function(table) {
    // Adicionar coluna RA (Registro de Aluno)
    table.string('ra', 10).unique();
    
    // Adicionar índice para busca rápida por RA
    table.index('ra', 'idx_matricula_aluno_ra');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('matricula_aluno', function(table) {
    table.dropIndex('ra', 'idx_matricula_aluno_ra');
    table.dropColumn('ra');
  });
};
