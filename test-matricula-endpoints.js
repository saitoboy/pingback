/**
 * Script para testar os endpoints de matrícula de aluno
 * Execute este arquivo para fazer testes básicos na API
 */

// Exemplos de requests para testar no Postman ou Insomnia

const baseURL = 'http://localhost:3003';

console.log('🧪 GUIA DE TESTES - ENDPOINTS DE MATRÍCULA DE ALUNO');
console.log('=' .repeat(60));

console.log('\n📋 ENDPOINTS DISPONÍVEIS:');
console.log('');

console.log('1️⃣ GET /matricula-aluno - Listar todas as matrículas');
console.log(`   URL: ${baseURL}/matricula-aluno`);
console.log('   Headers: Authorization: Bearer <token>');
console.log('');

console.log('2️⃣ GET /matricula-aluno/:id - Buscar matrícula por ID');
console.log(`   URL: ${baseURL}/matricula-aluno/uuid-da-matricula`);
console.log('   Headers: Authorization: Bearer <token>');
console.log('');

console.log('3️⃣ GET /matricula-aluno/aluno/:aluno_id - Buscar matrículas do aluno');
console.log(`   URL: ${baseURL}/matricula-aluno/aluno/uuid-do-aluno`);
console.log('   Headers: Authorization: Bearer <token>');
console.log('');

console.log('4️⃣ GET /matricula-aluno/turma/:turma_id - Buscar matrículas da turma');
console.log(`   URL: ${baseURL}/matricula-aluno/turma/uuid-da-turma`);
console.log('   Headers: Authorization: Bearer <token>');
console.log('');

console.log('5️⃣ GET /matricula-aluno/ano-letivo/:ano_letivo_id - Buscar matrículas do ano');
console.log(`   URL: ${baseURL}/matricula-aluno/ano-letivo/uuid-do-ano`);
console.log('   Headers: Authorization: Bearer <token>');
console.log('');

console.log('6️⃣ GET /matricula-aluno/status/:status - Buscar matrículas por status');
console.log(`   URL: ${baseURL}/matricula-aluno/status/ativo`);
console.log('   Headers: Authorization: Bearer <token>');
console.log('   Status válidos: ativo, transferido, concluido, cancelado');
console.log('');

console.log('7️⃣ GET /matricula-aluno/ativa/:aluno_id/:ano_letivo_id - Buscar matrícula ativa');
console.log(`   URL: ${baseURL}/matricula-aluno/ativa/uuid-aluno/uuid-ano`);
console.log('   Headers: Authorization: Bearer <token>');
console.log('');

console.log('8️⃣ POST /matricula-aluno - Criar nova matrícula (ADMIN/SECRETARIO)');
console.log(`   URL: ${baseURL}/matricula-aluno`);
console.log('   Headers: Authorization: Bearer <token>, Content-Type: application/json');
console.log('   Body:');
console.log(`   {
     "aluno_id": "uuid-do-aluno",
     "turma_id": "uuid-da-turma", 
     "ano_letivo_id": "uuid-do-ano",
     "data_matricula": "2025-08-08"
   }`);
console.log('');

console.log('9️⃣ PUT /matricula-aluno/:id - Atualizar matrícula (ADMIN/SECRETARIO)');
console.log(`   URL: ${baseURL}/matricula-aluno/uuid-da-matricula`);
console.log('   Headers: Authorization: Bearer <token>, Content-Type: application/json');
console.log('   Body:');
console.log(`   {
     "status": "transferido",
     "motivo_saida": "Transferência para outra escola"
   }`);
console.log('');

console.log('🔟 PUT /matricula-aluno/:id/transferir - Transferir aluno (ADMIN/SECRETARIO)');
console.log(`   URL: ${baseURL}/matricula-aluno/uuid-da-matricula/transferir`);
console.log('   Headers: Authorization: Bearer <token>, Content-Type: application/json');
console.log('   Body:');
console.log(`   {
     "nova_turma_id": "uuid-da-nova-turma",
     "motivo": "Mudança de turno"
   }`);
console.log('');

console.log('1️⃣1️⃣ PUT /matricula-aluno/:id/finalizar - Finalizar matrícula (ADMIN/SECRETARIO)');
console.log(`   URL: ${baseURL}/matricula-aluno/uuid-da-matricula/finalizar`);
console.log('   Headers: Authorization: Bearer <token>, Content-Type: application/json');
console.log('   Body:');
console.log(`   {
     "status": "concluido",
     "motivo": "Conclusão do ano letivo"
   }`);
console.log('   Status válidos: "concluido" ou "cancelado"');
console.log('');

console.log('1️⃣2️⃣ DELETE /matricula-aluno/:id - Deletar matrícula (ADMIN/SECRETARIO)');
console.log(`   URL: ${baseURL}/matricula-aluno/uuid-da-matricula`);
console.log('   Headers: Authorization: Bearer <token>');
console.log('');

console.log('🔐 AUTENTICAÇÃO:');
console.log('   Primeiro faça login em: POST /auth/login');
console.log('   Use o token retornado no header Authorization: Bearer <token>');
console.log('');

console.log('👥 AUTORIZAÇÃO:');
console.log('   Consultas (GET): Todos os usuários autenticados');
console.log('   Modificações (POST/PUT/DELETE): Apenas ADMIN e SECRETARIO');
console.log('');

console.log('📊 EXEMPLOS DE RESPOSTA:');
console.log('   Sucesso: { "sucesso": true, "dados": {...}, "mensagem": "..." }');
console.log('   Erro: { "sucesso": false, "mensagem": "Erro descritivo" }');
console.log('');

console.log('🎯 DICAS DE TESTE:');
console.log('   1. Primeiro teste a listagem geral para ver dados existentes');
console.log('   2. Teste criação com dados válidos de aluno/turma/ano existentes');
console.log('   3. Teste validações com dados inválidos');
console.log('   4. Teste transferência e finalização de matrículas');
console.log('   5. Verifique os logs no terminal do servidor para debugs');
console.log('');

console.log('✅ Sistema pronto para testes!');
console.log('=' .repeat(60));
