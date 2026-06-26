exports.up = async function (knex) {
  await knex.schema.createTable('turma_slot', function (table) {
    table.uuid('slot_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('turma_id').notNullable();
    table.integer('numero').notNullable(); // 1-5
    table.time('hora_inicio').notNullable();
    table.time('hora_fim').notNullable();
    table.timestamps(true, true);
    table.foreign('turma_id').references('turma_id').inTable('turma').onDelete('CASCADE');
    table.unique(['turma_id', 'numero']);
    table.index('turma_id');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('turma_slot');
};
