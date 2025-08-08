# 📋 Documentação - Endpoint de Criação de Matrícula

## 🎯 Visão Geral

O endpoint de criação de matrícula é responsável por matricular um aluno em uma turma específica de um ano letivo. Este é um dos endpoints mais importantes do sistema, pois estabelece a relação fundamental entre aluno, turma e ano letivo.

## 🔗 Endpoint

```
POST /matricula-aluno
```

**Base URL:** `http://localhost:3003`

## 🔐 Autenticação e Autorização

- **Autenticação:** Obrigatória (Token JWT)
- **Autorização:** Apenas usuários com perfil `ADMIN` ou `SECRETARIO`

### Headers Obrigatórios

```json
{
  "Authorization": "Bearer seu-token-jwt-aqui",
  "Content-Type": "application/json"
}
```

## 📝 Corpo da Requisição (Body)

### Campos Obrigatórios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `aluno_id` | UUID | ID do aluno a ser matriculado |
| `turma_id` | UUID | ID da turma onde o aluno será matriculado |
| `ano_letivo_id` | UUID | ID do ano letivo da matrícula |
| `data_matricula` | Date | Data da matrícula (formato: YYYY-MM-DD) |

### Campos Opcionais

| Campo | Tipo | Descrição | Valor Padrão |
|-------|------|-----------|--------------|
| `status` | Enum | Status da matrícula | `'ativo'` |

### Status Válidos
- `'ativo'` - Matrícula ativa (padrão)
- `'transferido'` - Aluno transferido
- `'concluido'` - Matrícula concluída
- `'cancelado'` - Matrícula cancelada

## 📋 Exemplo de Requisição

### JSON Body

```json
{
  "aluno_id": "123e4567-e89b-12d3-a456-426614174000",
  "turma_id": "987fcdeb-51a2-43d1-b789-123456789abc",
  "ano_letivo_id": "456789ab-cdef-1234-5678-9abcdef01234",
  "data_matricula": "2025-08-08"
}
```

### Requisição Completa no Postman

```http
POST http://localhost:3003/matricula-aluno
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "aluno_id": "1f60eb87-efde-4a4f-860f-8e7575b3e4cd",
  "turma_id": "30d6bc8e-5b97-4da7-9163-1ed14374df31",
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
  "data_matricula": "2025-08-08"
}
```

## ✅ Resposta de Sucesso (201 Created)

```json
{
  "sucesso": true,
  "mensagem": "Matrícula criada com sucesso",
  "dados": {
    "matricula_aluno_id": "789abc12-3def-4567-8901-23456789abcd",
    "ra": "2025101",
    "aluno_id": "123e4567-e89b-12d3-a456-426614174000",
    "turma_id": "987fcdeb-51a2-43d1-b789-123456789abc",
    "ano_letivo_id": "456789ab-cdef-1234-5678-9abcdef01234",
    "data_matricula": "2025-08-08T00:00:00.000Z",
    "data_saida": null,
    "motivo_saida": null,
    "status": "ativo",
    "created_at": "2025-08-08T21:45:00.123Z",
    "updated_at": "2025-08-08T21:45:00.123Z"
  }
}
```

### 🆔 **Campo RA (Registro de Aluno)**

O sistema agora gera automaticamente um **RA (Registro de Aluno)** único e memorável para cada matrícula:

- **Formato:** `{ANO}{SÉRIE}{SEQUENCIAL}`
- **Exemplo:** `2025101` = Ano 2025, 1ª série, aluno 001
- **Vantagens:** Fácil de lembrar, informativo e único

## ❌ Respostas de Erro

### 400 Bad Request - Dados Inválidos

```json
{
  "sucesso": false,
  "mensagem": "Dados inválidos: Campo \"aluno_id\" é obrigatório"
}
```

### 400 Bad Request - Aluno Não Encontrado

```json
{
  "sucesso": false,
  "mensagem": "Aluno não encontrado"
}
```

### 400 Bad Request - Turma Não Encontrada

```json
{
  "sucesso": false,
  "mensagem": "Turma não encontrada"
}
```

### 400 Bad Request - Ano Letivo Não Encontrado

```json
{
  "sucesso": false,
  "mensagem": "Ano letivo não encontrado"
}
```

### 400 Bad Request - Matrícula Duplicada

```json
{
  "sucesso": false,
  "mensagem": "Aluno já possui matrícula ativa neste ano letivo"
}
```

### 401 Unauthorized - Token Inválido

```json
{
  "mensagem": "Token inválido"
}
```

### 403 Forbidden - Sem Permissão

```json
{
  "mensagem": "Acesso negado. Permissão insuficiente."
}
```

### 500 Internal Server Error

```json
{
  "sucesso": false,
  "mensagem": "Erro interno do servidor ao criar matrícula"
}
```

## 🧪 Guia de Teste no Postman

### 1️⃣ Configurar Autenticação

1. **Fazer Login:**
   ```http
   POST http://localhost:3003/auth/login
   Content-Type: application/json

   {
     "email_usuario": "admin@escola.com",
     "senha_usuario": "sua-senha"
   }
   ```

2. **Copiar o Token:** Guarde o token retornado no campo `token` da resposta

### 2️⃣ Obter IDs Necessários

1. **Listar Alunos:**
   ```http
   GET http://localhost:3003/aluno
   Authorization: Bearer seu-token-aqui
   ```

2. **Listar Turmas:**
   ```http
   GET http://localhost:3003/turma
   Authorization: Bearer seu-token-aqui
   ```

3. **Listar Anos Letivos:**
   ```http
   GET http://localhost:3003/ano-letivo
   Authorization: Bearer seu-token-aqui
   ```

### 3️⃣ Criar Matrícula

Use os IDs obtidos nas etapas anteriores para criar a matrícula:

```http
POST http://localhost:3003/matricula-aluno
Authorization: Bearer seu-token-aqui
Content-Type: application/json

{
  "aluno_id": "id-real-do-aluno",
  "turma_id": "id-real-da-turma",
  "ano_letivo_id": "id-real-do-ano-letivo",
  "data_matricula": "2025-08-08"
}
```

### 4️⃣ Verificar Resultado

Após criar, você pode verificar se a matrícula foi criada corretamente:

```http
GET http://localhost:3003/matricula-aluno
Authorization: Bearer seu-token-aqui
```

## 🔍 Validações Realizadas

### 1. **Validações de Entrada**
- ✅ Campos obrigatórios preenchidos
- ✅ Formato correto dos UUIDs
- ✅ Data de matrícula válida

### 2. **Validações de Integridade**
- ✅ Aluno existe no sistema
- ✅ Turma existe no sistema
- ✅ Ano letivo existe no sistema
- ✅ Aluno não possui matrícula ativa no mesmo ano letivo

### 3. **Validações de Autorização**
- ✅ Usuário autenticado
- ✅ Usuário tem permissão (ADMIN ou SECRETARIO)

## 🚀 Exemplos de Casos de Uso

### Caso 1: Matrícula Simples
```json
{
  "aluno_id": "123e4567-e89b-12d3-a456-426614174000",
  "turma_id": "987fcdeb-51a2-43d1-b789-123456789abc",
  "ano_letivo_id": "456789ab-cdef-1234-5678-9abcdef01234",
  "data_matricula": "2025-02-01"
}
```

### Caso 2: Matrícula com Status Específico
```json
{
  "aluno_id": "123e4567-e89b-12d3-a456-426614174000",
  "turma_id": "987fcdeb-51a2-43d1-b789-123456789abc",
  "ano_letivo_id": "456789ab-cdef-1234-5678-9abcdef01234",
  "data_matricula": "2025-02-01",
  "status": "ativo"
}
```

## 📊 Logs do Sistema

O sistema registra logs detalhados para auditoria:

```
📋 [MATRICULA] ➕ Criando nova matrícula para aluno: 123e4567-e89b-12d3-a456-426614174000
📋 [MATRICULA] ✅ Matrícula criada com sucesso: 789abc12-3def-4567-8901-23456789abcd
```

## 🔗 Endpoints Relacionados

Após criar uma matrícula, você pode usar estes endpoints relacionados:

- `GET /matricula-aluno` - Listar todas as matrículas
- `GET /matricula-aluno/{id}` - Buscar matrícula específica
- `GET /matricula-aluno/ra/{ra}` - **🆔 Buscar matrícula por RA**
- `PUT /matricula-aluno/{id}` - Atualizar matrícula
- `PUT /matricula-aluno/{id}/transferir` - **🔄 Transferir aluno (inteligente)**
- `PUT /matricula-aluno/{id}/finalizar` - Finalizar matrícula
- `DELETE /matricula-aluno/{id}` - Deletar matrícula

### 🔄 **Transferência Inteligente**

O endpoint de transferência agora distingue automaticamente:

**Transferência de Turma (mesmo ano letivo):**
- Atualiza a matrícula existente
- Mantém o RA e todos os dados acadêmicos
- Ideal para mudanças de turno, disciplina, etc.

**Mudança de Ano Letivo:**
- Finaliza a matrícula atual
- Cria nova matrícula com novo RA
- Preserva histórico completo

## ⚠️ Observações Importantes

1. **RA Automático:** O sistema gera automaticamente um RA único no formato `{ANO}{SÉRIE}{SEQUENCIAL}`
2. **Transferência Inteligente:** 
   - Mesmo ano letivo → Atualiza matrícula existente (dados preservados)
   - Ano letivo diferente → Cria nova matrícula (novo RA)
3. **Unicidade:** Um aluno só pode ter uma matrícula ativa por ano letivo
4. **Dependências:** Aluno, turma e ano letivo devem existir antes da matrícula
5. **Auditoria:** Todas as operações são logadas para auditoria
6. **Timestamps:** `created_at` e `updated_at` são preenchidos automaticamente
7. **Status Padrão:** Se não informado, o status padrão é `'ativo'`

## 🛠️ Troubleshooting

### Problema: "Aluno já possui matrícula ativa neste ano letivo"
**Solução:** Verifique se o aluno já tem uma matrícula ativa no mesmo ano letivo usando:
```http
GET /matricula-aluno/ativa/{aluno_id}/{ano_letivo_id}
```

### Problema: "Token inválido"
**Solução:** Faça login novamente para obter um token válido.

### Problema: "Aluno não encontrado"
**Solução:** Verifique se o `aluno_id` existe na base de dados usando:
```http
GET /aluno/{aluno_id}
```

---

**✅ Sistema pronto para criação de matrículas!**

Para mais informações sobre outros endpoints, consulte a documentação completa da API.
