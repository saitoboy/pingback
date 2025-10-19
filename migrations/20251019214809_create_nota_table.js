/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('nota', function(table) {
    table.uuid('nota_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('atividade_id').notNullable();
    table.uuid('matricula_aluno_id').notNullable();
    table.decimal('valor', 3, 1).notNullable(); // Nota de 0.0 a 10.0
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Foreign keys
    table.foreign('atividade_id').references('atividade_id').inTable('atividade').onDelete('CASCADE');
    table.foreign('matricula_aluno_id').references('matricula_aluno_id').inTable('matricula_aluno').onDelete('CASCADE');
    
    // Indexes
    table.index(['atividade_id'], 'idx_nota_atividade');
    table.index(['matricula_aluno_id'], 'idx_nota_aluno');
    table.index(['valor'], 'idx_nota_valor');
    table.index(['created_at'], 'idx_nota_created_at');
    
    // Constraint de unicidade - um aluno pode ter apenas uma nota por atividade
    table.unique(['atividade_id', 'matricula_aluno_id'], 'uk_nota_atividade_aluno');
    
    // Constraint para valor da nota entre 0 e 10
    table.check('valor >= 0 AND valor <= 10', 'check_nota_valor');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('nota');
};
