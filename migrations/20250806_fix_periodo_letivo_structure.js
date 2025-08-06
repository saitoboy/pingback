/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('periodo_letivo', function(table) {
    // Remove as colunas antigas
    table.dropColumn('nome_periodo');
    table.dropColumn('ordem');
    
    // Adiciona as novas colunas
    table.integer('bimestre').notNullable();
    table.uuid('ano_letivo_id').notNullable();
    
    // Adiciona os timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Adiciona chave estrangeira
    table.foreign('ano_letivo_id').references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');
    
    // Índices para otimização
    table.index('bimestre');
    table.index('ano_letivo_id');
    table.index('created_at');
    
    // Constraint de unicidade - cada bimestre pode existir apenas uma vez por ano letivo
    table.unique(['bimestre', 'ano_letivo_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('periodo_letivo', function(table) {
    // Remove as colunas novas
    table.dropForeign('ano_letivo_id');
    table.dropUnique(['bimestre', 'ano_letivo_id']);
    table.dropColumn('bimestre');
    table.dropColumn('ano_letivo_id');
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
    
    // Restaura as colunas antigas
    table.string('nome_periodo', 50);
    table.integer('ordem');
  });
};
