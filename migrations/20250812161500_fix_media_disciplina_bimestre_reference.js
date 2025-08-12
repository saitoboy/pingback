/**
 * Migration para corrigir a tabela media_disciplina_bimestre
 * Substituir disciplina_id por turma_disciplina_professor_id
 */

exports.up = function(knex) {
  return knex.schema.alterTable('media_disciplina_bimestre', function(table) {
    // Adicionar nova coluna turma_disciplina_professor_id
    table.uuid('turma_disciplina_professor_id').references('turma_disciplina_professor_id').inTable('turma_disciplina_professor').onDelete('CASCADE');
  })
  .then(() => {
    // Remover a coluna disciplina_id
    return knex.schema.alterTable('media_disciplina_bimestre', function(table) {
      table.dropColumn('disciplina_id');
    });
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('media_disciplina_bimestre', function(table) {
    // Reverter as alterações
    table.dropColumn('turma_disciplina_professor_id');
    
    // Restaurar disciplina_id
    table.uuid('disciplina_id').references('disciplina_id').inTable('disciplina').onDelete('CASCADE');
  });
};
