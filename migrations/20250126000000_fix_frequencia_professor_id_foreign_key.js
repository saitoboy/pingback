/**
 * Migração: Corrigir foreign key de professor_id na tabela frequencia
 * 
 * O campo professor_id na tabela frequencia na verdade armazena usuario_id,
 * então a foreign key deve referenciar usuario.usuario_id, não professor.professor_id
 */

exports.up = async function(knex) {
  console.log('🔄 Iniciando migração: Corrigir foreign key de professor_id em frequencia');
  
  // 1. Remover a foreign key antiga (se existir)
  try {
    await knex.raw(`
      ALTER TABLE frequencia 
      DROP CONSTRAINT IF EXISTS frequencia_professor_id_foreign;
    `);
    console.log('✅ Foreign key antiga removida');
  } catch (error) {
    console.log('⚠️ Erro ao remover foreign key antiga (pode não existir):', error.message);
  }
  
  // 2. Adicionar a foreign key correta referenciando usuario.usuario_id
  await knex.raw(`
    ALTER TABLE frequencia
    ADD CONSTRAINT frequencia_professor_id_foreign
    FOREIGN KEY (professor_id)
    REFERENCES usuario(usuario_id)
    ON DELETE CASCADE;
  `);
  
  console.log('✅ Foreign key corrigida: frequencia.professor_id → usuario.usuario_id');
  console.log('✅ Migração concluída com sucesso!');
};

exports.down = async function(knex) {
  console.log('🔄 Revertendo migração: Foreign key de professor_id em frequencia');
  
  // Remover a foreign key correta
  try {
    await knex.raw(`
      ALTER TABLE frequencia 
      DROP CONSTRAINT IF EXISTS frequencia_professor_id_foreign;
    `);
    console.log('✅ Foreign key removida');
  } catch (error) {
    console.log('⚠️ Erro ao remover foreign key:', error.message);
  }
  
  // Restaurar a foreign key antiga (referenciando professor.professor_id)
  // NOTA: Isso pode falhar se não houver dados correspondentes na tabela professor
  try {
    await knex.raw(`
      ALTER TABLE frequencia
      ADD CONSTRAINT frequencia_professor_id_foreign
      FOREIGN KEY (professor_id)
      REFERENCES professor(professor_id)
      ON DELETE CASCADE;
    `);
    console.log('✅ Foreign key antiga restaurada');
  } catch (error) {
    console.log('⚠️ Erro ao restaurar foreign key antiga:', error.message);
    console.log('⚠️ Pode ser necessário migrar dados antes de restaurar');
  }
  
  console.log('✅ Reversão concluída');
};

