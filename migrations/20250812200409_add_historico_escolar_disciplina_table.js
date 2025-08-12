/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('historico_escolar_disciplina', (table) => {
    table.uuid('historico_disciplina_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('historico_escolar_id').notNullable().references('historico_escolar_id').inTable('historico_escolar').onDelete('CASCADE');
    table.uuid('turma_disciplina_professor_id').notNullable().references('turma_disciplina_professor_id').inTable('turma_disciplina_professor').onDelete('CASCADE');
    table.decimal('media_final_disciplina', 4, 2).notNullable().checkPositive();
    table.integer('total_faltas_disciplina').notNullable().defaultTo(0).checkPositive();
    table.enum('situacao_disciplina', ['aprovado', 'reprovado', 'recuperacao', 'em_andamento'])
         .notNullable()
         .defaultTo('em_andamento');
    table.text('observacoes_disciplina');
    table.timestamps(true, true);

    // Índices para melhorar performance
    table.index(['historico_escolar_id'], 'idx_hist_disc_historico');
    table.index(['turma_disciplina_professor_id'], 'idx_hist_disc_tdp');
    table.index(['situacao_disciplina'], 'idx_hist_disc_situacao');
    
    // Constraint de unicidade: uma disciplina por histórico
    table.unique(['historico_escolar_id', 'turma_disciplina_professor_id'], 'uk_historico_disciplina');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('historico_escolar_disciplina');
};
