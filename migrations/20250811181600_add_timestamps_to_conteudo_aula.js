/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('conteudo_aula', function(table) {
    table.text('conteudo'); // Campo para conteúdo detalhado da aula
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Adicionar índices para performance
    table.index(['aula_id'], 'idx_conteudo_aula');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('conteudo_aula', function(table) {
    table.dropIndex(['aula_id'], 'idx_conteudo_aula');
    table.dropColumn('conteudo');
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
