/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return knex.schema.alterTable('periodo_letivo', function(table) {
    // Primeiro adiciona as novas colunas permitindo NULL temporariamente
    table.integer('bimestre').nullable();
    table.uuid('ano_letivo_id').nullable();
    
    // Adiciona os timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  }).then(() => {
    // Depois, em uma operação separada, remove as colunas antigas se existirem
    return knex.schema.alterTable('periodo_letivo', function(table) {
      // Verifica se as colunas existem antes de tentar remover
      table.dropColumn('nome_periodo');
      table.dropColumn('ordem');
    });
  }).then(() => {
    // Por último, torna as colunas obrigatórias e adiciona constraints
    return knex.schema.alterTable('periodo_letivo', function(table) {
      // Modifica as colunas para NOT NULL
      table.integer('bimestre').notNullable().alter();
      table.uuid('ano_letivo_id').notNullable().alter();
      
      // Adiciona chave estrangeira
      table.foreign('ano_letivo_id').references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');
      
      // Índices para otimização
      table.index('bimestre');
      table.index('ano_letivo_id');
      table.index('created_at');
      
      // Constraint de unicidade
      table.unique(['bimestre', 'ano_letivo_id']);
    });
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
