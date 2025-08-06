# 📚 Testes Postman - Período Letivo

## 📋 Configuração Inicial

**Base URL:** `http://localhost:3003`
**Autenticação:** Bearer Token (obrigatório em todas as rotas)

### 1. 🔐 Fazer Login Primeiro
```
POST http://localhost:3003/auth/login
Content-Type: application/json

{
  "email": "admin@escola.com",
  "senha": "senha123"
}
```

**Copie o token da resposta para usar nos próximos testes!**

---

## 📚 Endpoints de Período Letivo

### 1. 📝 Criar Período Letivo Individual
```
POST http://localhost:3003/periodo-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "bimestre": 1,
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38"
}
```

### 🧪 Teste - 2º Bimestre
```json
{
  "bimestre": 2,
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38"
}
```

### 🧪 Teste - 3º Bimestre
```json
{
  "bimestre": 3,
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38"
}
```

### 🧪 Teste - 4º Bimestre
```json
{
  "bimestre": 4,
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38"
}
```

### 2. 🚀 Criar TODOS os Bimestres de Uma Vez
```
POST http://localhost:3003/periodo-letivo/criar-todos/b7aa6637-185c-4aa4-9284-14266b446c38
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```
*Não precisa de body - cria automaticamente os 4 bimestres*

### 3. 📋 Listar Todos os Períodos Letivos
```
GET http://localhost:3003/periodo-letivo
Authorization: Bearer SEU_TOKEN_AQUI
```

### 4. 🔍 Buscar Período Letivo por ID
```
GET http://localhost:3003/periodo-letivo/ID_DO_PERIODO_LETIVO
Authorization: Bearer SEU_TOKEN_AQUI
```

### 5. 📅 Buscar Períodos por Ano Letivo
```
GET http://localhost:3003/periodo-letivo/ano/b7aa6637-185c-4aa4-9284-14266b446c38
Authorization: Bearer SEU_TOKEN_AQUI
```

### 6. 🎯 Buscar Bimestre Específico
```
GET http://localhost:3003/periodo-letivo/bimestre/1/ano/b7aa6637-185c-4aa4-9284-14266b446c38
Authorization: Bearer SEU_TOKEN_AQUI
```

### 7. ✏️ Atualizar Período Letivo
```
PUT http://localhost:3003/periodo-letivo/ID_DO_PERIODO_LETIVO
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "bimestre": 2
}
```

### 8. 🗑️ Deletar Período Letivo
```
DELETE http://localhost:3003/periodo-letivo/ID_DO_PERIODO_LETIVO
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🧪 Testes de Validação

### Teste 1: Campos Obrigatórios
```
POST http://localhost:3003/periodo-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "bimestre": "",
  "ano_letivo_id": ""
}
```
**Resultado esperado:** Erro 400 com lista de campos obrigatórios

### Teste 2: Bimestre Inválido
```
POST http://localhost:3003/periodo-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "bimestre": 5,
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38"
}
```
**Resultado esperado:** Erro 400 - Bimestre deve estar entre 1 e 4

### Teste 3: Ano Letivo Inexistente
```
POST http://localhost:3003/periodo-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "bimestre": 1,
  "ano_letivo_id": "00000000-0000-0000-0000-000000000000"
}
```
**Resultado esperado:** Erro 404 - Ano letivo não encontrado

### Teste 4: Bimestre Duplicado
```
POST http://localhost:3003/periodo-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "bimestre": 1,
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38"
}
```
**Resultado esperado:** Erro 409 - Já existe o 1º bimestre para este ano letivo (se já criado)

---

## ✅ Fluxo de Teste Recomendado

1. **Login** → Pegar token
2. **Listar períodos** → Ver quais já existem
3. **Criar todos os bimestres** → Para o ano 2025
4. **Listar novamente** → Verificar se criou os 4
5. **Buscar por ano** → Ver bimestres do ano 2025
6. **Buscar bimestre específico** → Testar busca por 1º bimestre
7. **Tentar criar duplicado** → Testar validação
8. **Atualizar um bimestre** → Modificar para outro número
9. **Deletar um bimestre** → Remover para testar

---

## 🚨 Códigos de Resposta Esperados

- **200** - Sucesso (GET, PUT, DELETE)
- **201** - Criado com sucesso (POST)
- **400** - Dados inválidos (validação)
- **401** - Não autenticado (sem token)
- **403** - Sem permissão (não é ADMIN/SECRETARIO)
- **404** - Não encontrado
- **409** - Conflito (bimestre duplicado)
- **500** - Erro interno

---

## 💡 Dicas

1. **Sempre use o token** obtido no login
2. **Use o ID do ano 2025** que criamos: `b7aa6637-185c-4aa4-9284-14266b446c38`
3. **Bimestres válidos:** 1, 2, 3, 4
4. **Função "criar-todos"** é super útil para configurar um ano completo
5. **Cada bimestre é único** por ano letivo
6. **Copie os IDs** dos períodos criados para testar updates/deletes

---

## 🔍 Casos de Uso Comuns

### Configurar Ano Letivo Completo
```
POST http://localhost:3003/periodo-letivo/criar-todos/b7aa6637-185c-4aa4-9284-14266b446c38
Authorization: Bearer SEU_TOKEN_AQUI
```

### Criar Bimestre Específico
```json
{
  "bimestre": 1,
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38"
}
```

### Ver Todos os Bimestres de 2025
```
GET http://localhost:3003/periodo-letivo/ano/b7aa6637-185c-4aa4-9284-14266b446c38
```

---

## 📊 Exemplos de Resposta

### Sucesso - Criação Individual
```json
{
  "sucesso": true,
  "mensagem": "Período letivo criado com sucesso",
  "dados": {
    "periodo_letivo_id": "uuid-gerado",
    "bimestre": 1,
    "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
    "created_at": "2025-08-06T21:00:00.000Z",
    "updated_at": "2025-08-06T21:00:00.000Z"
  }
}
```

### Sucesso - Criar Todos os Bimestres
```json
{
  "sucesso": true,
  "mensagem": "4 bimestres criados com sucesso",
  "dados": [
    {
      "periodo_letivo_id": "uuid-1",
      "bimestre": 1,
      "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
      "created_at": "2025-08-06T21:00:00.000Z",
      "updated_at": "2025-08-06T21:00:00.000Z"
    },
    {
      "periodo_letivo_id": "uuid-2",
      "bimestre": 2,
      "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
      "created_at": "2025-08-06T21:00:00.000Z",
      "updated_at": "2025-08-06T21:00:00.000Z"
    },
    {
      "periodo_letivo_id": "uuid-3",
      "bimestre": 3,
      "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
      "created_at": "2025-08-06T21:00:00.000Z",
      "updated_at": "2025-08-06T21:00:00.000Z"
    },
    {
      "periodo_letivo_id": "uuid-4",
      "bimestre": 4,
      "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
      "created_at": "2025-08-06T21:00:00.000Z",
      "updated_at": "2025-08-06T21:00:00.000Z"
    }
  ]
}
```

### Sucesso - Listagem por Ano
```json
{
  "sucesso": true,
  "dados": [
    {
      "periodo_letivo_id": "uuid-1",
      "bimestre": 1,
      "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
      "created_at": "2025-08-06T21:00:00.000Z",
      "updated_at": "2025-08-06T21:00:00.000Z"
    },
    {
      "periodo_letivo_id": "uuid-2",
      "bimestre": 2,
      "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
      "created_at": "2025-08-06T21:00:00.000Z",
      "updated_at": "2025-08-06T21:00:00.000Z"
    },
    {
      "periodo_letivo_id": "uuid-3",
      "bimestre": 3,
      "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
      "created_at": "2025-08-06T21:00:00.000Z",
      "updated_at": "2025-08-06T21:00:00.000Z"
    },
    {
      "periodo_letivo_id": "uuid-4",
      "bimestre": 4,
      "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
      "created_at": "2025-08-06T21:00:00.000Z",
      "updated_at": "2025-08-06T21:00:00.000Z"
    }
  ]
}
```

### Erro - Bimestre Duplicado
```json
{
  "sucesso": false,
  "mensagem": "Já existe o 1º bimestre para este ano letivo"
}
```

### Erro - Bimestre Inválido
```json
{
  "sucesso": false,
  "mensagem": "Dados inválidos: Campo 'bimestre' deve ser um número inteiro entre 1 e 4"
}
```

---

## 🎯 Cenários de Teste Específicos

### Cenário 1: Configuração Inicial do Ano
1. Criar ano letivo 2025 (se não criou ainda)
2. Usar "criar-todos" para gerar os 4 bimestres
3. Verificar se todos foram criados corretamente

### Cenário 2: Gestão Manual de Bimestres
1. Criar bimestres individuais (1º, 2º, 3º, 4º)
2. Testar validações de duplicação
3. Atualizar e deletar conforme necessário

### Cenário 3: Busca e Consultas
1. Listar todos os períodos
2. Filtrar por ano letivo específico
3. Buscar bimestre específico

### Cenário 4: Validações e Erros
1. Testar criação com dados inválidos
2. Testar com ano letivo inexistente
3. Testar duplicação de bimestres
