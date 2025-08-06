/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('turma', function(table) {
    // Adiciona os timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Índices para otimização
    table.index('serie_id');
    table.index('ano_letivo_id');
    table.index('turno');
    table.index('created_at');
    
    // Chaves estrangeiras (se não existirem)
    table.foreign('serie_id').references('serie_id').inTable('serie').onDelete('CASCADE');
    table.foreign('ano_letivo_id').references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');
    
    // Constraint de unicidade - nome da turma deve ser único por série e ano letivo
    table.unique(['nome_turma', 'serie_id', 'ano_letivo_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('turma', function(table) {
    table.dropForeign('serie_id');
    table.dropForeign('ano_letivo_id');
    table.dropUnique(['nome_turma', 'serie_id', 'ano_letivo_id']);
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
