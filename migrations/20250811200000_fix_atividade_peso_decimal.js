/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('atividade', function(table) {
    // Alterar coluna peso de integer para decimal
    table.decimal('peso', 5, 2).alter(); // 5 dígitos totais, 2 decimais (ex: 100.00)
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('atividade', function(table) {
    // Reverter para integer
    table.integer('peso').alter();
  });
};
