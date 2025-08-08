/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Primeiro, limpa todos os dados da tabela para evitar conflitos
  await knex('periodo_letivo').del();
  
  // Remove as colunas antigas
  await knex.schema.alterTable('periodo_letivo', function(table) {
    table.dropColumn('nome_periodo');
    table.dropColumn('ordem');
  });
  
  // Adiciona as novas colunas
  await knex.schema.alterTable('periodo_letivo', function(table) {
    table.integer('bimestre').notNullable();
    table.uuid('ano_letivo_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Adiciona chave estrangeira
    table.foreign('ano_letivo_id').references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');
    
    // Índices para otimização
    table.index('bimestre');
    table.index('ano_letivo_id');
    table.index('created_at');
    
    // Constraint de unicidade
    table.unique(['bimestre', 'ano_letivo_id']);
  });
  
  // Popula com dados básicos (4 bimestres para cada ano letivo)
  const anosLetivos = await knex('ano_letivo').select('ano_letivo_id');
  
  for (const anoLetivo of anosLetivos) {
    for (let bimestre = 1; bimestre <= 4; bimestre++) {
      await knex('periodo_letivo').insert({
        periodo_letivo_id: knex.raw('uuid_generate_v4()'),
        bimestre: bimestre,
        ano_letivo_id: anoLetivo.ano_letivo_id,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      });
    }
  }
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
