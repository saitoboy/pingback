/**
 * Migration: remove a constraint UNIQUE de rg_aluno, pois o RG não é mais
 * obrigatório no formulário de cadastro e múltiplos alunos podem ter valor vazio.
 */

exports.up = async function(knex) {
  await knex.schema.alterTable('aluno', function(table) {
    table.dropUnique(['rg_aluno'], 'aluno_rg_aluno_unique');
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('aluno', function(table) {
    table.unique(['rg_aluno'], 'aluno_rg_aluno_unique');
  });
};
