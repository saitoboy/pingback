/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('historico_escolar', (table) => {
    // Remover campos que agora vão para historico_escolar_disciplina
    table.dropColumn('media_final_anual');
    table.dropColumn('total_faltas_anual');
    
    // Adicionar campos de controle geral
    table.decimal('media_geral_anual', 4, 2).nullable(); // Média geral de todas as disciplinas
    table.integer('total_disciplinas_cursadas').defaultTo(0);
    table.integer('disciplinas_aprovadas').defaultTo(0);
    table.integer('disciplinas_reprovadas').defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('historico_escolar', (table) => {
    // Restaurar campos originais
    table.decimal('media_final_anual', 4, 2).notNullable().defaultTo(0);
    table.integer('total_faltas_anual').notNullable().defaultTo(0);
    
    // Remover novos campos
    table.dropColumn('media_geral_anual');
    table.dropColumn('total_disciplinas_cursadas');
    table.dropColumn('disciplinas_aprovadas');
    table.dropColumn('disciplinas_reprovadas');
  });
};
