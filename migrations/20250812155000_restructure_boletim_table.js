exports.up = function(knex) {
  return knex.schema.alterTable('boletim', function(table) {
    // Remover campos que não fazem sentido para boletim bimestral
    table.dropColumn('ano_letivo_id');
    table.dropColumn('status');
    table.dropColumn('tipo');
    
    // Adicionar campo correto para período letivo (bimestre)
    table.uuid('periodo_letivo_id').notNullable();
    table.foreign('periodo_letivo_id').references('periodo_letivo_id').inTable('periodo_letivo').onDelete('CASCADE');
    
    // Adicionar observações gerais do bimestre (opcional)
    table.text('observacoes_gerais').nullable();
    
    // Adicionar índices para performance
    table.index(['matricula_aluno_id'], 'idx_boletim_matricula_aluno');
    table.index(['periodo_letivo_id'], 'idx_boletim_periodo_letivo');
    table.index(['matricula_aluno_id', 'periodo_letivo_id'], 'idx_boletim_matricula_periodo');
    
    // Constraint de unicidade: um boletim por aluno por bimestre
    table.unique(['matricula_aluno_id', 'periodo_letivo_id'], 'uk_boletim_matricula_periodo');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('boletim', function(table) {
    // Remover constraint e índices
    table.dropUnique(['matricula_aluno_id', 'periodo_letivo_id'], 'uk_boletim_matricula_periodo');
    table.dropIndex(['matricula_aluno_id', 'periodo_letivo_id'], 'idx_boletim_matricula_periodo');
    table.dropIndex(['periodo_letivo_id'], 'idx_boletim_periodo_letivo');
    table.dropIndex(['matricula_aluno_id'], 'idx_boletim_matricula_aluno');
    
    // Remover campos novos
    table.dropForeign(['periodo_letivo_id']);
    table.dropColumn('periodo_letivo_id');
    table.dropColumn('observacoes_gerais');
    
    // Restaurar campos antigos
    table.uuid('ano_letivo_id').notNullable();
    table.foreign('ano_letivo_id').references('ano_letivo_id').inTable('ano_letivo').onDelete('CASCADE');
    table.enum('status', ['aprovado', 'reprovado']).notNullable();
    table.enum('tipo', ['completo', 'simplificado']).notNullable();
  });
};
