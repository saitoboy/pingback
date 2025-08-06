#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Configurando banco de dados...\n');

try {
  // Verificar status das migrações
  console.log('📋 Verificando status das migrações:');
  execSync('npx knex migrate:status', { stdio: 'inherit' });
  
  console.log('\n🚀 Executando migrações pendentes:');
  const result = execSync('npx knex migrate:latest --verbose', { stdio: 'inherit' });
  
  console.log('\n✅ Setup do banco concluído com sucesso!');
  console.log('\n📊 Status final:');
  execSync('npx knex migrate:status', { stdio: 'inherit' });
  
} catch (error) {
  console.error('\n❌ Erro durante o setup do banco:', error.message);
  process.exit(1);
}
