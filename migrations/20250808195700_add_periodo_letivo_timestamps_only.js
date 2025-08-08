/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Verifica se as colunas já existem
  const hasCreatedAt = await knex.schema.hasColumn('periodo_letivo', 'created_at');
  const hasUpdatedAt = await knex.schema.hasColumn('periodo_letivo', 'updated_at');
  
  if (!hasCreatedAt || !hasUpdatedAt) {
    return knex.schema.alterTable('periodo_letivo', function(table) {
      if (!hasCreatedAt) {
        table.timestamp('created_at').defaultTo(knex.fn.now());
      }
      if (!hasUpdatedAt) {
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      }
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('periodo_letivo', function(table) {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
