/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('historico_escolar', (table) => {
    table.uuid('historico_escolar_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('matricula_aluno_id').notNullable().references('matricula_aluno_id').inTable('matricula_aluno').onDelete('CASCADE');
    table.uuid('ano_letivo_id').notNullable().references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');
    table.decimal('media_final_anual', 4, 2).notNullable().checkPositive();
    table.integer('total_faltas_anual').notNullable().defaultTo(0).checkPositive();
    table.enum('situacao_final', ['aprovado', 'reprovado', 'aprovado_conselho', 'transferido', 'em_andamento'])
         .notNullable()
         .defaultTo('em_andamento');
    table.text('observacoes_finais');
    table.date('data_conclusao');
    table.timestamps(true, true);

    // Índices para melhorar performance
    table.index(['matricula_aluno_id'], 'idx_historico_matricula');
    table.index(['ano_letivo_id'], 'idx_historico_ano_letivo');
    table.index(['situacao_final'], 'idx_historico_situacao');
    
    // Constraint de unicidade: um histórico por aluno por ano letivo
    table.unique(['matricula_aluno_id', 'ano_letivo_id'], 'uk_historico_matricula_ano');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('historico_escolar');
};
