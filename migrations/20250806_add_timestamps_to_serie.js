/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('serie', function(table) {
    // Adiciona os timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Índices para otimização
    table.index('nome_serie');
    table.index('created_at');
    
    // Constraint de unicidade - nome da série deve ser único
    table.unique('nome_serie');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('serie', function(table) {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
    table.dropUnique('nome_serie');
  });
};
