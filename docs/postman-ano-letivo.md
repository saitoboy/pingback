# 📅 Testes Postman - Ano Letivo

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

## 📅 Endpoints de Ano Letivo

### 1. 📝 Criar Ano Letivo
```
POST http://localhost:3003/ano-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "ano": 2025,
  "data_inicio": "2025-02-01",
  "data_fim": "2025-12-15",
  "ativo": true
}
```

### 🧪 Teste - Ano Letivo 2024
```json
{
  "ano": 2024,
  "data_inicio": "2024-02-05",
  "data_fim": "2024-12-20",
  "ativo": false
}
```

### 🧪 Teste - Ano Letivo 2026 (Futuro)
```json
{
  "ano": 2026,
  "data_inicio": "2026-02-03",
  "data_fim": "2026-12-18",
  "ativo": false
}
```

### 2. 📋 Listar Todos os Anos Letivos
```
GET http://localhost:3003/ano-letivo
Authorization: Bearer SEU_TOKEN_AQUI
```

### 3. 🔍 Buscar Ano Letivo por ID
```
GET http://localhost:3003/ano-letivo/ID_DO_ANO_LETIVO
Authorization: Bearer SEU_TOKEN_AQUI
```

### 4. 📅 Buscar Ano Letivo por Ano
```
GET http://localhost:3003/ano-letivo/ano/2025
Authorization: Bearer SEU_TOKEN_AQUI
```

### 5. ✏️ Atualizar Ano Letivo
```
PUT http://localhost:3003/ano-letivo/ID_DO_ANO_LETIVO
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "data_fim": "2025-12-20",
  "ativo": true
}
```

### 🧪 Atualização Completa
```json
{
  "ano": 2025,
  "data_inicio": "2025-02-05",
  "data_fim": "2025-12-22",
  "ativo": true
}
```

### 6. 🗑️ Deletar Ano Letivo
```
DELETE http://localhost:3003/ano-letivo/ID_DO_ANO_LETIVO
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🧪 Testes de Validação

### Teste 1: Campos Obrigatórios
```
POST http://localhost:3003/ano-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "ano": "",
  "data_inicio": "",
  "data_fim": ""
}
```
**Resultado esperado:** Erro 400 com lista de campos obrigatórios

### Teste 2: Ano Inválido
```
POST http://localhost:3003/ano-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "ano": 1900,
  "data_inicio": "2025-02-01",
  "data_fim": "2025-12-15",
  "ativo": true
}
```
**Resultado esperado:** Erro 400 - Ano deve estar entre 2000 e 2050

### Teste 3: Data de Fim Antes do Início
```
POST http://localhost:3003/ano-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "ano": 2025,
  "data_inicio": "2025-12-01",
  "data_fim": "2025-02-15",
  "ativo": true
}
```
**Resultado esperado:** Erro 400 - Data de fim deve ser posterior à data de início

### Teste 4: Ano Duplicado
```
POST http://localhost:3003/ano-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "ano": 2025,
  "data_inicio": "2025-02-01",
  "data_fim": "2025-12-15",
  "ativo": true
}
```
**Resultado esperado:** Erro 409 - Ano letivo já cadastrado (se 2025 já existir)

### Teste 5: Formato de Data Inválido
```
POST http://localhost:3003/ano-letivo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "ano": 2025,
  "data_inicio": "01/02/2025",
  "data_fim": "15/12/2025",
  "ativo": true
}
```
**Resultado esperado:** Erro 400 - Formato de data inválido (deve ser YYYY-MM-DD)

---

## ✅ Fluxo de Teste Recomendado

1. **Login** → Pegar token
2. **Listar anos letivos** → Ver quais já existem
3. **Criar ano letivo** → Ano 2025
4. **Listar novamente** → Verificar se criou
5. **Buscar por ID** → Testar busca específica
6. **Buscar por ano** → Testar busca por ano (ex: /ano/2025)
7. **Atualizar** → Modificar datas ou status ativo
8. **Tentar criar duplicado** → Testar validação de unicidade
9. **Criar ano passado** → Ano 2024 (inativo)
10. **Criar ano futuro** → Ano 2026 (inativo)
11. **Deletar** → Remover um ano de teste

---

## 🚨 Códigos de Resposta Esperados

- **200** - Sucesso (GET, PUT, DELETE)
- **201** - Criado com sucesso (POST)
- **400** - Dados inválidos (validação)
- **401** - Não autenticado (sem token)
- **403** - Sem permissão (não é ADMIN/SECRETARIO)
- **404** - Não encontrado
- **409** - Conflito (ano duplicado)
- **500** - Erro interno

---

## 💡 Dicas

1. **Sempre use o token** obtido no login
2. **Copie os IDs** das respostas para usar nos próximos testes
3. **Teste as validações** para garantir que funcionam
4. **Formato de data** deve ser YYYY-MM-DD (ISO)
5. **Apenas um ano ativo** por vez (regra de negócio recomendada)
6. **Anos válidos:** 2000 a 2050
7. **Data de fim** deve ser posterior à data de início

---

## 🔍 Casos de Uso Comuns

### Ano Letivo Atual (2025)
```json
{
  "ano": 2025,
  "data_inicio": "2025-02-01",
  "data_fim": "2025-12-15",
  "ativo": true
}
```

### Ano Letivo Passado (2024)
```json
{
  "ano": 2024,
  "data_inicio": "2024-02-05",
  "data_fim": "2024-12-20",
  "ativo": false
}
```

### Ano Letivo Futuro (2026)
```json
{
  "ano": 2026,
  "data_inicio": "2026-02-03",
  "data_fim": "2026-12-18",
  "ativo": false
}
```

### Ano Letivo com Cronograma Diferenciado
```json
{
  "ano": 2025,
  "data_inicio": "2025-01-15",
  "data_fim": "2025-11-30",
  "ativo": true
}
```

---

## 📊 Exemplos de Resposta

### Sucesso - Criação
```json
{
  "success": true,
  "message": "Ano letivo criado com sucesso",
  "data": {
    "ano_letivo_id": "uuid-gerado",
    "ano": 2025,
    "data_inicio": "2025-02-01T00:00:00.000Z",
    "data_fim": "2025-12-15T00:00:00.000Z",
    "ativo": true,
    "created_at": "2025-08-06T10:30:00.000Z",
    "updated_at": "2025-08-06T10:30:00.000Z"
  }
}
```

### Sucesso - Listagem
```json
{
  "success": true,
  "data": [
    {
      "ano_letivo_id": "uuid-1",
      "ano": 2024,
      "data_inicio": "2024-02-05T00:00:00.000Z",
      "data_fim": "2024-12-20T00:00:00.000Z",
      "ativo": false,
      "created_at": "2024-01-15T00:00:00.000Z",
      "updated_at": "2024-12-21T00:00:00.000Z"
    },
    {
      "ano_letivo_id": "uuid-2",
      "ano": 2025,
      "data_inicio": "2025-02-01T00:00:00.000Z",
      "data_fim": "2025-12-15T00:00:00.000Z",
      "ativo": true,
      "created_at": "2025-01-10T00:00:00.000Z",
      "updated_at": "2025-01-10T00:00:00.000Z"
    }
  ]
}
```

### Erro - Validação
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [
    "Campo 'ano' é obrigatório",
    "Campo 'data_inicio' é obrigatório",
    "Campo 'data_fim' é obrigatório"
  ]
}
```

### Erro - Ano Duplicado
```json
{
  "success": false,
  "message": "Ano letivo 2025 já está cadastrado"
}
```

---

## 🎯 Cenários de Teste Específicos

### Cenário 1: Preparação Ano Letivo 2025
1. Criar ano 2025 como ativo
2. Verificar se é o único ativo
3. Configurar datas de acordo com calendário escolar

### Cenário 2: Fechamento Ano 2024
1. Buscar ano 2024
2. Atualizar para ativo = false
3. Confirmar fechamento

### Cenário 3: Planejamento Futuro
1. Criar ano 2026 como inativo
2. Definir datas preliminares
3. Manter para futura ativação

### Cenário 4: Correção de Datas
1. Buscar ano ativo
2. Atualizar data_fim estendendo período
3. Confirmar alteração
