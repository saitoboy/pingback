/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('aula', function(table) {
    table.uuid('aula_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('turma_disciplina_professor_id').notNullable();
    table.date('data_aula').notNullable();
    table.time('hora_inicio').notNullable();
    table.time('hora_fim').notNullable();
    table.timestamps(true, true);
    
    // Foreign key constraint
    table.foreign('turma_disciplina_professor_id')
      .references('turma_disciplina_professor_id')
      .inTable('turma_disciplina_professor')
      .onDelete('CASCADE');
    
    // Indexes for better performance
    table.index(['turma_disciplina_professor_id']);
    table.index(['data_aula']);
    table.index(['data_aula', 'hora_inicio']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('aula');
};
