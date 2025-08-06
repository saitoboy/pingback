# 📚 Testes Postman - Série e Turma

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

## 📚 Endpoints de Série

### 1. 📝 Criar Série
```
POST http://localhost:3003/serie
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome_serie": "1º Ano"
}
```

### 🧪 Mais Séries para Testar
```json
{
  "nome_serie": "2º Ano"
}
```

```json
{
  "nome_serie": "3º Ano"
}
```

```json
{
  "nome_serie": "4º Ano"
}
```

```json
{
  "nome_serie": "5º Ano"
}
```

### 2. 📋 Listar Todas as Séries
```
GET http://localhost:3003/serie
Authorization: Bearer SEU_TOKEN_AQUI
```

### 3. 🔍 Buscar Série por ID
```
GET http://localhost:3003/serie/ID_DA_SERIE
Authorization: Bearer SEU_TOKEN_AQUI
```

### 4. 🔍 Buscar Série por Nome
```
GET http://localhost:3003/serie/nome/1º Ano
Authorization: Bearer SEU_TOKEN_AQUI
```

### 5. ✏️ Atualizar Série
```
PUT http://localhost:3003/serie/ID_DA_SERIE
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome_serie": "1º Ano - Ensino Fundamental"
}
```

### 6. 🗑️ Deletar Série
```
DELETE http://localhost:3003/serie/ID_DA_SERIE
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🏫 Endpoints de Turma

### 1. 📝 Criar Turma
```
POST http://localhost:3003/turma
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome_turma": "Turma A",
  "serie_id": "ID_DA_SERIE",
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
  "turno": "manhã",
  "sala": "Sala 01"
}
```

### 🧪 Mais Turmas para Testar
```json
{
  "nome_turma": "Turma B",
  "serie_id": "ID_DA_SERIE",
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
  "turno": "tarde",
  "sala": "Sala 02"
}
```

```json
{
  "nome_turma": "Turma C",
  "serie_id": "ID_DA_SERIE",
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
  "turno": "manhã",
  "sala": "Sala 03"
}
```

### 2. 📋 Listar Todas as Turmas
```
GET http://localhost:3003/turma
Authorization: Bearer SEU_TOKEN_AQUI
```

### 3. 🔍 Buscar Turma por ID
```
GET http://localhost:3003/turma/ID_DA_TURMA
Authorization: Bearer SEU_TOKEN_AQUI
```

### 4. 📚 Buscar Turmas por Série
```
GET http://localhost:3003/turma/serie/ID_DA_SERIE
Authorization: Bearer SEU_TOKEN_AQUI
```

### 5. 📅 Buscar Turmas por Ano Letivo
```
GET http://localhost:3003/turma/ano-letivo/b7aa6637-185c-4aa4-9284-14266b446c38
Authorization: Bearer SEU_TOKEN_AQUI
```

### 6. 🎯 Buscar Turmas por Série e Ano
```
GET http://localhost:3003/turma/serie/ID_DA_SERIE/ano/b7aa6637-185c-4aa4-9284-14266b446c38
Authorization: Bearer SEU_TOKEN_AQUI
```

### 7. 🌅 Buscar Turmas por Turno
```
GET http://localhost:3003/turma/turno/manhã
Authorization: Bearer SEU_TOKEN_AQUI
```

### 8. ✏️ Atualizar Turma
```
PUT http://localhost:3003/turma/ID_DA_TURMA
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome_turma": "Turma A - Modificada",
  "sala": "Sala 10"
}
```

### 9. 🗑️ Deletar Turma
```
DELETE http://localhost:3003/turma/ID_DA_TURMA
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🧪 Testes de Validação

### Série - Nome Duplicado
```
POST http://localhost:3003/serie
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome_serie": "1º Ano"
}
```
**Resultado esperado:** Erro 409 - Nome já existe

### Turma - Campos Obrigatórios
```
POST http://localhost:3003/turma
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome_turma": "",
  "serie_id": "",
  "ano_letivo_id": "",
  "turno": ""
}
```
**Resultado esperado:** Erro 400 com lista de campos obrigatórios

### Turma - Turno Inválido
```
POST http://localhost:3003/turma
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome_turma": "Turma Test",
  "serie_id": "ID_VALIDO",
  "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
  "turno": "madrugada",
  "sala": "Sala 01"
}
```
**Resultado esperado:** Erro 400 - Turno inválido

---

## ✅ Fluxo de Teste Recomendado

1. **Login** → Pegar token
2. **Criar séries** → 1º, 2º, 3º, 4º, 5º Ano
3. **Listar séries** → Pegar IDs das séries criadas
4. **Criar turmas** → Para cada série
5. **Listar turmas** → Ver todas criadas
6. **Buscar por filtros** → Série, ano letivo, turno
7. **Atualizar** → Modificar nomes e salas
8. **Testar validações** → Duplicatas e campos inválidos
9. **Deletar** → Testar proteções de integridade

---

## 💡 Informações Importantes

### Turnos Válidos:
- `manhã`
- `tarde` 
- `noite`
- `integral`

### Validações de Série:
- Nome obrigatório (máx 100 caracteres)
- Nome único no sistema
- Não pode deletar se tem turmas

### Validações de Turma:
- Nome obrigatório (máx 50 caracteres)
- Série e ano letivo obrigatórios
- Turno obrigatório (valores válidos)
- Sala opcional (máx 20 caracteres)
- Nome único por série+ano letivo
- Não pode deletar se tem alunos

---

## 📊 Exemplos de Resposta

### Sucesso - Criar Série
```json
{
  "sucesso": true,
  "mensagem": "Série criada com sucesso",
  "dados": {
    "serie_id": "uuid-gerado",
    "nome_serie": "1º Ano",
    "created_at": "2025-08-06T21:30:00.000Z",
    "updated_at": "2025-08-06T21:30:00.000Z"
  }
}
```

### Sucesso - Criar Turma
```json
{
  "sucesso": true,
  "mensagem": "Turma criada com sucesso",
  "dados": {
    "turma_id": "uuid-gerado",
    "nome_turma": "Turma A",
    "serie_id": "uuid-da-serie",
    "ano_letivo_id": "b7aa6637-185c-4aa4-9284-14266b446c38",
    "turno": "manhã",
    "sala": "Sala 01",
    "created_at": "2025-08-06T21:30:00.000Z",
    "updated_at": "2025-08-06T21:30:00.000Z"
  }
}
```

### Erro - Nome Duplicado
```json
{
  "sucesso": false,
  "mensagem": "Já existe uma série com o nome \"1º Ano\""
}
```

### Erro - Turno Inválido
```json
{
  "sucesso": false,
  "mensagem": "Dados inválidos: Campo 'turno' deve ser um dos valores: manhã, tarde, noite, integral"
}
```

---

## 🎯 Cenários de Teste Específicos

### Cenário 1: Configuração Escolar Básica
1. Criar séries do ensino fundamental (1º ao 5º ano)
2. Para cada série, criar turmas A, B, C
3. Distribuir entre turnos manhã e tarde
4. Verificar organização por filtros

### Cenário 2: Gestão de Turmas por Ano Letivo
1. Criar turmas para o ano 2025
2. Listar todas as turmas do ano
3. Organizar por série e turno
4. Testar atualizações de sala

### Cenário 3: Validações e Integridade
1. Tentar criar séries duplicadas
2. Tentar criar turmas com dados inválidos
3. Tentar deletar série com turmas
4. Verificar proteções do sistema
