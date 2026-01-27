/**
 * Script para corrigir a foreign key de professor_id na tabela frequencia
 * 
 * Execute este script se a migração já foi aplicada e você precisa corrigir a foreign key:
 * node scripts/fix_frequencia_professor_id_fk.js
 */

require('dotenv').config();
const knexfile = require('../knexfile');
const knex = require('knex')(knexfile[process.env.NODE_ENV || 'development']);

async function corrigirForeignKey() {
  try {
    console.log('🔄 Iniciando correção da foreign key de professor_id em frequencia...');
    
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
    
    // 3. Verificar se foi criada corretamente
    const result = await knex.raw(`
      SELECT 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE 
        tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'frequencia'
        AND kcu.column_name = 'professor_id';
    `);
    
    console.log('\n📋 Foreign key verificada:');
    console.log(JSON.stringify(result.rows, null, 2));
    
    console.log('\n✅ Correção concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao corrigir foreign key:', error);
    process.exit(1);
  }
}

corrigirForeignKey();

