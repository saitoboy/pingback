/**
 * Migration: Cria a tabela registro_diario
 *
 * O registro diário é um relatório por dia (um por turma_disciplina_professor + data)
 * que documenta o que foi feito na aula. Coexiste com as tabelas frequencia e atividade,
 * que continuam responsáveis pela chamada e pelas atividades avaliativas.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable('registro_diario');

  if (!hasTable) {
    await knex.schema.createTable('registro_diario', function (table) {
      table.uuid('registro_diario_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('turma_disciplina_professor_id').notNullable();
      table.date('data_aula').notNullable();

      // Conteúdo do relatório do dia
      table.text('resumo').notNullable(); // "O que foi feito" (HTML do editor rico)
      table.text('conteudo_programatico').nullable(); // Conteúdo do currículo coberto (HTML)
      table.text('metodologia').nullable();
      table.jsonb('recursos').nullable(); // Array de recursos utilizados (ex: ["Quadro", "Projetor"])
      table.text('observacoes').nullable(); // Anotações livres (HTML)
      table.jsonb('fotos').nullable(); // Array de imagens em base64 (opcional)
      table.string('status', 20).notNullable().defaultTo('rascunho'); // 'rascunho' | 'concluido'

      table.timestamps(true, true);

      // Foreign key
      table
        .foreign('turma_disciplina_professor_id')
        .references('turma_disciplina_professor_id')
        .inTable('turma_disciplina_professor')
        .onDelete('CASCADE');

      // Índices
      table.index('turma_disciplina_professor_id');
      table.index('data_aula');
      table.index(['turma_disciplina_professor_id', 'data_aula']);

      // Um único registro por vinculação + data
      table.unique(['turma_disciplina_professor_id', 'data_aula'], {
        indexName: 'registro_diario_vinculacao_data_unique',
      });
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('registro_diario');
};
