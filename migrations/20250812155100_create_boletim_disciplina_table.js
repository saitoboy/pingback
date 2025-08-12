exports.up = function(knex) {
  return knex.schema.createTable('boletim_disciplina', function(table) {
    // Chave primária
    table.uuid('boletim_disciplina_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Relacionamentos
    table.uuid('boletim_id').notNullable();
    table.foreign('boletim_id').references('boletim_id').inTable('boletim').onDelete('CASCADE');
    
    table.uuid('disciplina_id').notNullable();
    table.foreign('disciplina_id').references('disciplina_id').inTable('disciplina').onDelete('CASCADE');
    
    // Dados específicos da disciplina no bimestre
    table.decimal('media_bimestre', 4, 2).notNullable(); // Ex: 8.75
    table.integer('faltas_bimestre').defaultTo(0).notNullable();
    table.text('observacoes_disciplina').nullable();
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    
    // Índices para performance
    table.index(['boletim_id'], 'idx_boletim_disciplina_boletim');
    table.index(['disciplina_id'], 'idx_boletim_disciplina_disciplina');
    table.index(['created_at'], 'idx_boletim_disciplina_created_at');
    table.index(['updated_at'], 'idx_boletim_disciplina_updated_at');
    
    // Constraint de unicidade: uma entrada por disciplina por boletim
    table.unique(['boletim_id', 'disciplina_id'], 'uk_boletim_disciplina_boletim_disciplina');
    
    // Constraints de validação
    table.check('media_bimestre >= 0 AND media_bimestre <= 10', [], 'ck_boletim_disciplina_media_range');
    table.check('faltas_bimestre >= 0', [], 'ck_boletim_disciplina_faltas_positive');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('boletim_disciplina');
};
