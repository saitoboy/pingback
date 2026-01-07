/**
 * Script para corrigir migrações corrompidas no banco de dados
 * 
 * Este script remove registros de migrações que não existem mais no diretório de migrações
 * da tabela knex_migrations.
 * 
 * Execute este script se você receber o erro:
 * "The migration directory is corrupt, the following files are missing: [nome_da_migração]"
 * 
 * Uso:
 *   node scripts/fix_migration_corrupt.js
 * 
 * Para produção:
 *   NODE_ENV=production node scripts/fix_migration_corrupt.js
 */

require('dotenv').config();
const knexfile = require('../knexfile');
const fs = require('fs');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const knex = require('knex')(knexfile[environment]);

async function fixCorruptMigrations() {
  try {
    console.log('🔄 Iniciando correção de migrações corrompidas...');
    console.log(`📁 Ambiente: ${environment}`);
    
    // 1. Ler todas as migrações do diretório
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .map(file => file.replace('.js', ''));
    
    console.log(`\n📋 Migrações encontradas no diretório (${migrationFiles.length}):`);
    migrationFiles.forEach(file => console.log(`  - ${file}`));
    
    // 2. Buscar todas as migrações registradas no banco
    const registeredMigrations = await knex('knex_migrations')
      .select('name')
      .orderBy('name');
    
    console.log(`\n📋 Migrações registradas no banco (${registeredMigrations.length}):`);
    registeredMigrations.forEach(m => console.log(`  - ${m.name}`));
    
    // 3. Encontrar migrações registradas que não existem no diretório
    // Normalizar nomes: remover extensão .js se existir para comparação
    const registeredNames = registeredMigrations.map(m => {
      const name = m.name;
      return name.endsWith('.js') ? name.replace('.js', '') : name;
    });
    
    const corruptMigrations = registeredMigrations
      .map(m => m.name)
      .filter(name => {
        const normalizedName = name.endsWith('.js') ? name.replace('.js', '') : name;
        return !migrationFiles.includes(normalizedName);
      });
    
    if (corruptMigrations.length === 0) {
      console.log('\n✅ Nenhuma migração corrompida encontrada!');
      process.exit(0);
    }
    
    console.log(`\n⚠️  Migrações corrompidas encontradas (${corruptMigrations.length}):`);
    corruptMigrations.forEach(name => console.log(`  - ${name}`));
    
    // 4. Confirmar antes de remover
    console.log('\n⚠️  ATENÇÃO: Este script irá remover os registros das migrações corrompidas da tabela knex_migrations.');
    console.log('   Isso permitirá que o Knex execute as migrações novamente.');
    console.log('   Certifique-se de que as migrações atuais no diretório são compatíveis com o estado atual do banco.\n');
    
    // 5. Remover registros corrompidos
    for (const migrationName of corruptMigrations) {
      console.log(`🗑️  Removendo registro da migração: ${migrationName}`);
      
      const deleted = await knex('knex_migrations')
        .where('name', migrationName)
        .del();
      
      if (deleted > 0) {
        console.log(`   ✅ ${deleted} registro(s) removido(s)`);
      } else {
        console.log(`   ⚠️  Nenhum registro encontrado para remover`);
      }
    }
    
    // 6. Verificar estado final
    const remainingMigrations = await knex('knex_migrations')
      .select('name')
      .orderBy('name');
    
    console.log(`\n📋 Migrações restantes no banco (${remainingMigrations.length}):`);
    remainingMigrations.forEach(m => console.log(`  - ${m.name}`));
    
    console.log('\n✅ Correção concluída com sucesso!');
    console.log('   Agora você pode executar: npm run migrate');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao corrigir migrações:', error);
    console.error('\nDetalhes do erro:');
    console.error(error.stack);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
}

// Executar o script
fixCorruptMigrations();

