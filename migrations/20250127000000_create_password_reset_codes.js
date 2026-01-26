/**
 * Migração: Criar tabela para códigos de redefinição de senha
 * 
 * Esta tabela armazena códigos temporários enviados por email
 * para permitir que usuários redefinam suas senhas
 */

exports.up = async function(knex) {
  console.log('🔄 Iniciando migração: Criar tabela password_reset_codes');
  
  await knex.schema.createTable('password_reset_codes', (table) => {
    table.uuid('reset_code_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('usuario_id').notNullable();
    table.string('codigo', 6).notNullable(); // Código de 6 dígitos
    table.string('email_usuario').notNullable();
    table.timestamp('expira_em').notNullable(); // Expira em 15 minutos
    table.boolean('usado').defaultTo(false); // Se o código já foi usado
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign key para usuario
    table.foreign('usuario_id')
      .references('usuario_id')
      .inTable('usuario')
      .onDelete('CASCADE');
    
    // Índices para melhor performance
    table.index('codigo');
    table.index('email_usuario');
    table.index('usuario_id');
    table.index('expira_em');
  });
  
  console.log('✅ Tabela password_reset_codes criada com sucesso!');
};

exports.down = async function(knex) {
  console.log('🔄 Revertendo migração: Remover tabela password_reset_codes');
  
  await knex.schema.dropTableIfExists('password_reset_codes');
  
  console.log('✅ Tabela password_reset_codes removida');
};
