/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Verificar se as colunas já existem antes de adicionar
  const hasStatus = await knex.schema.hasColumn('matricula_aluno', 'status');
  const hasCreatedAt = await knex.schema.hasColumn('matricula_aluno', 'created_at');
  const hasUpdatedAt = await knex.schema.hasColumn('matricula_aluno', 'updated_at');

  return knex.schema.alterTable('matricula_aluno', function(table) {
    // Adicionar coluna status se não existir
    if (!hasStatus) {
      table.enum('status', ['ativo', 'transferido', 'concluido', 'cancelado']).defaultTo('ativo');
    }
    
    // Adicionar timestamps se não existirem
    if (!hasCreatedAt) {
      table.timestamp('created_at').defaultTo(knex.fn.now());
    }
    if (!hasUpdatedAt) {
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    }
  }).then(() => {
    // Adicionar índices se não existirem
    return Promise.all([
      knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_matricula_aluno_status ON matricula_aluno(status)'),
      knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_matricula_aluno_data_matricula ON matricula_aluno(data_matricula)'),
      knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_matricula_aluno_aluno_id ON matricula_aluno(aluno_id)'),
      knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_matricula_aluno_turma_id ON matricula_aluno(turma_id)'),
      knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_matricula_aluno_ano_letivo_id ON matricula_aluno(ano_letivo_id)')
    ]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('matricula_aluno', function(table) {
    table.dropColumn('status');
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  }).then(() => {
    // Remover índices
    return Promise.all([
      knex.schema.raw('DROP INDEX IF EXISTS idx_matricula_aluno_status'),
      knex.schema.raw('DROP INDEX IF EXISTS idx_matricula_aluno_data_matricula'),
      knex.schema.raw('DROP INDEX IF EXISTS idx_matricula_aluno_aluno_id'),
      knex.schema.raw('DROP INDEX IF EXISTS idx_matricula_aluno_turma_id'),
      knex.schema.raw('DROP INDEX IF EXISTS idx_matricula_aluno_ano_letivo_id')
    ]);
  });
};
