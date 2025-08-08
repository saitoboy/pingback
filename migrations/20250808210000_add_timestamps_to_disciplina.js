/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('disciplina', function(table) {
    // Adicionar colunas de timestamp se não existirem
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('disciplina', function(table) {
    // Remover colunas de timestamp
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
