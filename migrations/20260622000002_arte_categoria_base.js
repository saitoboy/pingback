exports.up = async function(knex) {
  await knex('disciplina')
    .whereILike('nome_disciplina', 'arte')
    .update({ categoria: 'base', updated_at: new Date() });
};

exports.down = async function(knex) {
  await knex('disciplina')
    .whereILike('nome_disciplina', 'arte')
    .update({ categoria: 'especial', updated_at: new Date() });
};
