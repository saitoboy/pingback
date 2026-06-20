/**
 * Migração:
 *  1. Adiciona a coluna `categoria` em `disciplina` (base | especial)
 *     - "base": disciplinas do currículo padrão (regentes do 1º ao 5º ano)
 *     - "especial": disciplinas dadas por professores específicos (teatro, xadrez, etc)
 *  2. Cria a tabela `professor_disciplina` (habilitação): quais disciplinas
 *     cada professor está apto a lecionar.
 *
 * Convenção: `professor_id` referencia `usuario.usuario_id` (igual a
 * `turma_disciplina_professor`).
 */

const DISCIPLINAS_BASE = [
  'Matemática',
  'Língua Portuguesa',
  'Geografia',
  'Ciências',
  'História',
  'Educação Religiosa'
];

exports.up = async function (knex) {
  console.log('🔄 Migração: categoria em disciplina + tabela professor_disciplina');

  // 1. Coluna categoria em disciplina
  const temCategoria = await knex.schema.hasColumn('disciplina', 'categoria');
  if (!temCategoria) {
    await knex.schema.alterTable('disciplina', (table) => {
      table.string('categoria', 20).notNullable().defaultTo('especial');
      table.index('categoria');
    });
    console.log('✅ Coluna "categoria" adicionada em disciplina');
  }

  // Marcar as disciplinas do currículo base
  const atualizadas = await knex('disciplina')
    .whereIn('nome_disciplina', DISCIPLINAS_BASE)
    .update({ categoria: 'base' });
  console.log(`✅ ${atualizadas} disciplinas marcadas como "base"`);

  // 2. Tabela professor_disciplina (habilitação)
  const temTabela = await knex.schema.hasTable('professor_disciplina');
  if (!temTabela) {
    await knex.schema.createTable('professor_disciplina', (table) => {
      table.uuid('professor_disciplina_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('professor_id').notNullable(); // = usuario.usuario_id
      table.uuid('disciplina_id').notNullable();
      table.timestamps(true, true);

      // Foreign keys
      table.foreign('professor_id').references('usuario_id').inTable('usuario').onDelete('CASCADE');
      table.foreign('disciplina_id').references('disciplina_id').inTable('disciplina').onDelete('CASCADE');

      // Índices
      table.index('professor_id');
      table.index('disciplina_id');

      // Um professor não pode ser habilitado na mesma disciplina duas vezes
      table.unique(['professor_id', 'disciplina_id']);
    });
    console.log('✅ Tabela professor_disciplina criada');
  }
};

exports.down = async function (knex) {
  console.log('🔄 Revertendo migração: professor_disciplina + categoria');

  await knex.schema.dropTableIfExists('professor_disciplina');

  const temCategoria = await knex.schema.hasColumn('disciplina', 'categoria');
  if (temCategoria) {
    await knex.schema.alterTable('disciplina', (table) => {
      table.dropColumn('categoria');
    });
  }

  console.log('✅ Migração revertida');
};
