#!/usr/bin/env node

/**
 * Script para criar usuário administrador no banco de dados
 * 
 * Uso:
 *   node scripts/create-admin-user.js
 *   node scripts/create-admin-user.js admin@escola.com Admin123 Admin Nome
 */

require('dotenv/config');
const bcrypt = require('bcryptjs');
const knex = require('knex');

// Criar conexão com o banco de dados
const connection = knex({
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  },
  pool: {
    min: 2,
    max: 10
  }
});

// Configurações padrão
const DEFAULT_EMAIL = 'admin@escola.com';
const DEFAULT_PASSWORD = 'admin123';
const DEFAULT_NAME = 'Administrador';

async function createAdminUser(email, password, nome) {
  try {
    console.log('🔧 Criando usuário administrador...\n');

    // 1. Buscar o tipo de usuário 'admin'
    const tipoAdmin = await connection('usuario_tipo')
      .where({ nome_tipo: 'admin' })
      .first();

    if (!tipoAdmin) {
      throw new Error('Tipo de usuário "admin" não encontrado! Execute as migrações primeiro.');
    }

    console.log(`✅ Tipo de usuário encontrado: ${tipoAdmin.nome_tipo} (ID: ${tipoAdmin.tipo_usuario_id})`);

    // 2. Verificar se o email já existe
    const usuarioExistente = await connection('usuario')
      .where({ email_usuario: email })
      .first();

    if (usuarioExistente) {
      console.log(`⚠️  Usuário com email ${email} já existe!`);
      console.log(`   ID: ${usuarioExistente.usuario_id}`);
      console.log(`   Nome: ${usuarioExistente.nome_usuario}`);
      return;
    }

    // 3. Gerar hash da senha
    console.log('🔐 Gerando hash da senha...');
    const hashSenha = await bcrypt.hash(password, 10);
    console.log('✅ Hash gerado com sucesso');

    // 4. Criar o usuário
    console.log('👤 Criando usuário...');
    const [novoUsuario] = await connection('usuario')
      .insert({
        nome_usuario: nome,
        email_usuario: email,
        senha_usuario: hashSenha,
        tipo_usuario_id: tipoAdmin.tipo_usuario_id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning(['usuario_id', 'nome_usuario', 'email_usuario', 'tipo_usuario_id']);

    console.log('\n✅ Usuário administrador criado com sucesso!');
    console.log('\n📋 Dados do usuário:');
    console.log(`   ID: ${novoUsuario.usuario_id}`);
    console.log(`   Nome: ${novoUsuario.nome_usuario}`);
    console.log(`   Email: ${novoUsuario.email_usuario}`);
    console.log(`   Tipo: Admin`);
    console.log('\n🔑 Credenciais de acesso:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}`);
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

  } catch (error) {
    console.error('\n❌ Erro ao criar usuário administrador:', error.message);
    process.exit(1);
  } finally {
    await connection.destroy();
  }
}

// Executar script
const args = process.argv.slice(2);
const email = args[0] || DEFAULT_EMAIL;
const password = args[1] || DEFAULT_PASSWORD;
const nome = args[2] || DEFAULT_NAME;

createAdminUser(email, password, nome);

