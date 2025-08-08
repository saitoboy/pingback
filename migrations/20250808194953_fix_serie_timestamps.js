/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Verifica se as colunas já existem
  const hasCreatedAt = await knex.schema.hasColumn('serie', 'created_at');
  const hasUpdatedAt = await knex.schema.hasColumn('serie', 'updated_at');
  
  if (!hasCreatedAt || !hasUpdatedAt) {
    return knex.schema.alterTable('serie', function(table) {
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
  return knex.schema.alterTable('serie', function(table) {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
