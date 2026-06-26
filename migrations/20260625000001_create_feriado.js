exports.up = async function (knex) {
  await knex.schema.createTable('feriado', function (table) {
    table.uuid('feriado_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('ano_letivo_id').notNullable();
    table.date('data').notNullable();
    table.string('descricao').notNullable();
    table.timestamps(true, true);

    // Foreign keys
    table.foreign('ano_letivo_id').references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');

    // Índices
    table.index('ano_letivo_id');
    table.index('data');

    // Um feriado por data dentro do mesmo ano letivo
    table.unique(['ano_letivo_id', 'data']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('feriado');
};
