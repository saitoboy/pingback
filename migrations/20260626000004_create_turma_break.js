exports.up = async function (knex) {
  await knex.schema.createTable('turma_break', function (table) {
    table.uuid('break_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('turma_id').notNullable();
    table.integer('dia_semana').nullable(); // NULL = todos os dias; 1=Seg … 5=Sex
    table.enu('tipo', ['lanche', 'recreio']).notNullable();
    table.time('hora_inicio').notNullable();
    table.time('hora_fim').notNullable();
    table.timestamps(true, true);

    table.foreign('turma_id').references('turma_id').inTable('turma').onDelete('CASCADE');
    table.index('turma_id');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('turma_break');
};
