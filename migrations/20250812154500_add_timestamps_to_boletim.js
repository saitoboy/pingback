exports.up = function(knex) {
  return knex.schema.table('boletim', function(table) {
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Adicionar índices para performance nas consultas
    table.index(['created_at'], 'idx_boletim_created_at');
    table.index(['updated_at'], 'idx_boletim_updated_at');
  });
};

exports.down = function(knex) {
  return knex.schema.table('boletim', function(table) {
    table.dropIndex(['created_at'], 'idx_boletim_created_at');
    table.dropIndex(['updated_at'], 'idx_boletim_updated_at');
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
