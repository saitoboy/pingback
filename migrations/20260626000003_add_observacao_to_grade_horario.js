exports.up = async function (knex) {
  await knex.schema.alterTable('grade_horario_professor', function (table) {
    table.text('observacao').nullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('grade_horario_professor', function (table) {
    table.dropColumn('observacao');
  });
};
