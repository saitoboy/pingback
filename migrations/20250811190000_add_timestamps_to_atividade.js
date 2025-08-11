/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('atividade', function(table) {
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Adicionar índices para performance
    table.index(['turma_disciplina_professor_id'], 'idx_atividade_vinculacao');
    table.index(['aula_id'], 'idx_atividade_aula');
    table.index(['periodo_letivo_id'], 'idx_atividade_periodo');
    table.index(['vale_nota'], 'idx_atividade_vale_nota');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('atividade', function(table) {
    table.dropIndex(['turma_disciplina_professor_id'], 'idx_atividade_vinculacao');
    table.dropIndex(['aula_id'], 'idx_atividade_aula');
    table.dropIndex(['periodo_letivo_id'], 'idx_atividade_periodo');
    table.dropIndex(['vale_nota'], 'idx_atividade_vale_nota');
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
