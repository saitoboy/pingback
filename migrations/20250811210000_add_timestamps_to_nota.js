/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('nota', function(table) {
    // Adicionar colunas de timestamp
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Adicionar índices para performance
    table.index(['atividade_id'], 'idx_nota_atividade');
    table.index(['matricula_aluno_id'], 'idx_nota_aluno');
    table.index(['valor'], 'idx_nota_valor');
    table.index(['created_at'], 'idx_nota_created_at');
    
    // Constraint de unicidade - um aluno pode ter apenas uma nota por atividade
    table.unique(['atividade_id', 'matricula_aluno_id'], 'uk_nota_atividade_aluno');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('nota', function(table) {
    // Remover constraint de unicidade
    table.dropUnique(['atividade_id', 'matricula_aluno_id'], 'uk_nota_atividade_aluno');
    
    // Remover índices
    table.dropIndex(['atividade_id'], 'idx_nota_atividade');
    table.dropIndex(['matricula_aluno_id'], 'idx_nota_aluno');
    table.dropIndex(['valor'], 'idx_nota_valor');
    table.dropIndex(['created_at'], 'idx_nota_created_at');
    
    // Remover colunas de timestamp
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
