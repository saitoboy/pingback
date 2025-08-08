# 🚀 Guia Rápido - Teste de Matrícula no Postman

## 📥 Como Importar a Coleção

1. **Abra o Postman**
2. **Clique em "Import"** (no canto superior esquerdo)
3. **Selecione o arquivo:** `docs/Postman-Matricula-Collection.json`
4. **Clique em "Import"**

## ⚙️ Configuração Inicial

Após importar, a coleção já está configurada com:
- ✅ **Base URL:** `http://localhost:3003`
- ✅ **Variáveis automáticas** para IDs
- ✅ **Scripts de teste** que salvam dados automaticamente
- ✅ **Autenticação Bearer Token** configurada

## 🎯 Ordem de Execução Recomendada

### 1️⃣ **Fazer Login** 
- Execute o request `0. Fazer Login`
- **Configure suas credenciais** no corpo da requisição
- O token será salvo automaticamente

### 2️⃣ **Obter IDs Necessários**
Execute em sequência:
- `1. Listar Alunos` (salva aluno_id automaticamente)
- `2. Listar Turmas` (salva turma_id automaticamente)  
- `3. Listar Anos Letivos` (salva ano_letivo_id automaticamente)

### 3️⃣ **Criar Matrícula**
- Execute `4. Criar Matrícula`
- Os IDs são preenchidos automaticamente das etapas anteriores
- O ID da nova matrícula é salvo automaticamente

### 4️⃣ **Testar Outros Endpoints**
Agora você pode executar qualquer outro endpoint da coleção

## 🔧 Customização

### Alterar Dados Manualmente
Se quiser usar IDs específicos, edite as variáveis da coleção:
1. Clique na coleção
2. Vá em "Variables" 
3. Edite os valores conforme necessário

### Variáveis Disponíveis
- `{{base_url}}` - URL base da API
- `{{auth_token}}` - Token de autenticação
- `{{aluno_id}}` - ID do aluno
- `{{turma_id}}` - ID da turma
- `{{ano_letivo_id}}` - ID do ano letivo
- `{{matricula_id}}` - ID da matrícula criada

## 📋 Requests Incluídos

| # | Endpoint | Método | Descrição |
|---|----------|---------|-----------|
| 0 | `/auth/login` | POST | Fazer login e obter token |
| 1 | `/aluno` | GET | Listar alunos |
| 2 | `/turma` | GET | Listar turmas |
| 3 | `/ano-letivo` | GET | Listar anos letivos |
| 4 | `/matricula-aluno` | POST | **Criar matrícula** |
| 5 | `/matricula-aluno` | GET | Listar todas as matrículas |
| 6 | `/matricula-aluno/{id}` | GET | Buscar por ID |
| 7 | `/matricula-aluno/aluno/{id}` | GET | Matrículas do aluno |
| 8 | `/matricula-aluno/turma/{id}` | GET | Matrículas da turma |
| 9 | `/matricula-aluno/status/{status}` | GET | Matrículas por status |
| 10 | `/matricula-aluno/ativa/{aluno}/{ano}` | GET | Matrícula ativa |
| 11 | `/matricula-aluno/{id}` | PUT | Atualizar matrícula |
| 12 | `/matricula-aluno/{id}/transferir` | PUT | Transferir aluno |
| 13 | `/matricula-aluno/{id}/finalizar` | PUT | Finalizar matrícula |
| 14 | `/matricula-aluno/{id}` | DELETE | Deletar matrícula |

## 🎯 Cenários de Teste Prontos

### ✅ Fluxo Completo Automatizado
1. Execute requests 0-4 em sequência
2. Todos os IDs são obtidos e usados automaticamente
3. Matrícula é criada sem intervenção manual

### ✅ Teste de Validações
- Execute `4. Criar Matrícula` com dados inválidos
- Teste com aluno inexistente
- Teste matrícula duplicada

### ✅ Teste de Operações
- Crie uma matrícula
- Teste transferência (`12`)
- Teste finalização (`13`)
- Teste busca por status (`9`)

## ⚠️ Requisitos

- ✅ Servidor rodando em `http://localhost:3003`
- ✅ Banco de dados configurado e migrado
- ✅ Pelo menos um aluno, turma e ano letivo cadastrados
- ✅ Usuário com perfil ADMIN ou SECRETARIO

## 🆘 Troubleshooting

### Erro: "Token inválido"
**Solução:** Execute novamente o request `0. Fazer Login`

### Erro: "Aluno/Turma/Ano não encontrado"  
**Solução:** Verifique se existem dados nas tabelas correspondentes

### Erro: "Matrícula já existe"
**Solução:** Use IDs diferentes ou delete a matrícula existente

### Erro de Conexão
**Solução:** Verifique se o servidor está rodando na porta 3003

## 🎉 Resultado Esperado

Após executar o fluxo completo, você terá:
- ✅ Token de autenticação válido
- ✅ IDs válidos salvos nas variáveis
- ✅ Matrícula criada com sucesso
- ✅ Possibilidade de testar todos os outros endpoints

---

**🚀 Pronto para testar! Execute a sequência 0→1→2→3→4 e depois explore os demais endpoints.**
