/**
 * Migration: adiciona coluna `anexos` (jsonb) à tabela registro_diario.
 *
 * Guarda anexos genéricos do registro diário (imagens, PDFs, outros arquivos)
 * como array de objetos: { nome, tipo, tamanho, dados (base64 data URL) }.
 *
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('registro_diario', function (table) {
    table.jsonb('anexos').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('registro_diario', function (table) {
    table.dropColumn('anexos');
  });
};
