/**
 * Migration: Corrigir enum de turno na tabela turma
 * Altera de enum para string com check constraint para aceitar valores com acentuação
 * 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // 1. Adicionar coluna temporária
  await knex.schema.alterTable('turma', function(table) {
    table.string('turno_temp', 20).nullable();
  });

  // 2. Migrar dados existentes (converter valores do enum para os novos valores)
  await knex.raw(`
    UPDATE turma 
    SET turno_temp = CASE 
      WHEN turno::text = 'manha' THEN 'manhã'
      WHEN turno::text = 'tarde' THEN 'tarde'
      WHEN turno::text = 'noite' THEN 'noite'
      ELSE turno::text
    END
  `);

  // 3. Remover a coluna enum antiga
  await knex.raw(`
    ALTER TABLE turma DROP COLUMN turno
  `);

  // 4. Renomear a coluna temporária
  await knex.raw(`
    ALTER TABLE turma RENAME COLUMN turno_temp TO turno
  `);

  // 5. Tornar a coluna NOT NULL
  await knex.schema.alterTable('turma', function(table) {
    table.string('turno', 20).notNullable().alter();
  });

  // 6. Adicionar check constraint com os valores corretos
  await knex.raw(`
    ALTER TABLE turma 
    ADD CONSTRAINT turma_turno_check 
    CHECK (turno IN ('manhã', 'tarde', 'noite', 'integral'))
  `);

  // 7. Recriar o índice
  await knex.schema.alterTable('turma', function(table) {
    table.index('turno');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Remover check constraint
  await knex.raw(`
    ALTER TABLE turma DROP CONSTRAINT IF EXISTS turma_turno_check
  `);

  // Adicionar coluna temporária
  await knex.schema.alterTable('turma', function(table) {
    table.enum('turno_temp', ['manha', 'tarde', 'noite']).nullable();
  });

  // Migrar dados de volta
  await knex.raw(`
    UPDATE turma 
    SET turno_temp = CASE 
      WHEN turno = 'manhã' THEN 'manha'::turma_turno_temp
      WHEN turno = 'tarde' THEN 'tarde'::turma_turno_temp
      WHEN turno = 'noite' THEN 'noite'::turma_turno_temp
      ELSE 'manha'::turma_turno_temp
    END
  `);

  // Remover coluna antiga
  await knex.raw(`
    ALTER TABLE turma DROP COLUMN turno
  `);

  // Renomear
  await knex.raw(`
    ALTER TABLE turma RENAME COLUMN turno_temp TO turno
  `);

  // Tornar NOT NULL
  await knex.schema.alterTable('turma', function(table) {
    table.enum('turno', ['manha', 'tarde', 'noite']).notNullable().alter();
  });
};

