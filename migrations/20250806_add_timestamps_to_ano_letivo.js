/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('ano_letivo', function(table) {
    // Adiciona a coluna ativo que estava faltando
    table.boolean('ativo').defaultTo(false);
    
    // Adiciona os timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Índices para otimização (só os novos)
    table.index('ativo');
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('ano_letivo', function(table) {
    // Remove apenas as colunas que foram adicionadas nesta migração
    table.dropColumn('ativo');
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
