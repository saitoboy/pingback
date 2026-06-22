exports.up = async function(knex) {
  await knex.schema.alterTable('periodo_letivo', function(table) {
    table.date('data_inicio').nullable();
    table.date('data_fim').nullable();
  });

  // Remove 4º período caso exista (sistema passa a usar 3 trimestres)
  await knex('periodo_letivo').where('bimestre', 4).delete();
};

exports.down = async function(knex) {
  await knex.schema.alterTable('periodo_letivo', function(table) {
    table.dropColumn('data_inicio');
    table.dropColumn('data_fim');
  });
};
