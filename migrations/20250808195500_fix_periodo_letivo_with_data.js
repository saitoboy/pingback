/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Primeiro, adiciona as novas colunas permitindo NULL
  await knex.schema.alterTable('periodo_letivo', function(table) {
    table.integer('bimestre').nullable();
    table.uuid('ano_letivo_id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Pega o primeiro ano letivo disponível para usar como padrão
  const primeiroAnoLetivo = await knex('ano_letivo').first();
  
  if (primeiroAnoLetivo) {
    // Popula os dados existentes com valores padrão
    await knex('periodo_letivo').update({
      bimestre: knex.raw('CASE WHEN ordem IS NOT NULL THEN ordem ELSE 1 END'),
      ano_letivo_id: primeiroAnoLetivo.ano_letivo_id
    });
  }

  // Remove as colunas antigas
  await knex.schema.alterTable('periodo_letivo', function(table) {
    table.dropColumn('nome_periodo');
    table.dropColumn('ordem');
  });

  // Agora torna as colunas obrigatórias e adiciona constraints
  await knex.schema.alterTable('periodo_letivo', function(table) {
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
