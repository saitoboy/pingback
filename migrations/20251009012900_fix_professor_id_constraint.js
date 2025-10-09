/**
 * Migration para corrigir a FK constraint de professor_id
 * Agora professor_id referencia usuario.usuario_id ao invés de professor.professor_id
 * 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Usar SQL raw para evitar problemas com constraints
  await knex.raw(`
    -- Remover a FK constraint antiga
    ALTER TABLE turma_disciplina_professor 
    DROP CONSTRAINT IF EXISTS turma_disciplina_professor_professor_id_foreign;
    
    -- Criar nova FK constraint referenciando usuario
    ALTER TABLE turma_disciplina_professor 
    ADD CONSTRAINT turma_disciplina_professor_professor_id_foreign 
    FOREIGN KEY (professor_id) 
    REFERENCES usuario(usuario_id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Reverter: remover FK de usuario e recriar para professor
  await knex.raw(`
    -- Remover FK de usuario
    ALTER TABLE turma_disciplina_professor 
    DROP CONSTRAINT IF EXISTS turma_disciplina_professor_professor_id_foreign;
    
    -- Recriar FK para professor (caso precise fazer rollback)
    ALTER TABLE turma_disciplina_professor 
    ADD CONSTRAINT turma_disciplina_professor_professor_id_foreign 
    FOREIGN KEY (professor_id) 
    REFERENCES professor(professor_id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;
  `);
};
