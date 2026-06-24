/**
 * Regra: uma disciplina em uma turma só pode ter UM professor.
 * Troca o unique antigo (turma_id, disciplina_id, professor_id) — que permitia
 * dois professores diferentes na mesma disciplina/turma — pelo unique
 * (turma_id, disciplina_id), garantindo a regra no nível do banco.
 *
 * Obs.: se já existir dado violando (mesma turma+disciplina com 2 professores),
 * a criação do unique vai falhar. Limpe os duplicados antes de rodar.
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('turma_disciplina_professor', function (table) {
    table.dropUnique(['turma_id', 'disciplina_id', 'professor_id']);
    table.unique(['turma_id', 'disciplina_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('turma_disciplina_professor', function (table) {
    table.dropUnique(['turma_id', 'disciplina_id']);
    table.unique(['turma_id', 'disciplina_id', 'professor_id']);
  });
};
