exports.up = async function(knex) {
  await knex.schema.alterTable('aula', function(table) {
    table.uuid('periodo_letivo_id').nullable();
    table.foreign('periodo_letivo_id').references('periodo_letivo_id').inTable('periodo_letivo').onDelete('SET NULL');
    table.index('periodo_letivo_id');
  });

  await knex.schema.alterTable('matricula_aluno', function(table) {
    table.uuid('periodo_letivo_id').nullable();
    table.foreign('periodo_letivo_id').references('periodo_letivo_id').inTable('periodo_letivo').onDelete('SET NULL');
    table.index('periodo_letivo_id');
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('aula', function(table) {
    table.dropForeign(['periodo_letivo_id']);
    table.dropIndex(['periodo_letivo_id']);
    table.dropColumn('periodo_letivo_id');
  });

  await knex.schema.alterTable('matricula_aluno', function(table) {
    table.dropForeign(['periodo_letivo_id']);
    table.dropIndex(['periodo_letivo_id']);
    table.dropColumn('periodo_letivo_id');
  });
};
