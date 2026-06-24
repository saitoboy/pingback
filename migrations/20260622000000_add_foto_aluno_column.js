/**
 * Migration: adiciona coluna foto_aluno (base64 ou URL) na tabela aluno
 */

exports.up = async function(knex) {
  await knex.schema.alterTable('aluno', function(table) {
    table.text('foto_aluno').nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('aluno', function(table) {
    table.dropColumn('foto_aluno');
  });
};
