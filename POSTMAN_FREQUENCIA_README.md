# 📋 Guia de Testes - Endpoints de Frequência

Este guia explica como testar todos os endpoints de frequência no Postman.

## ⚠️ IMPORTANTE: Sobre o `professor_id`

**O campo `professor_id` nos endpoints de frequência na verdade é o `usuario_id` do usuário cadastrado como professor.**

- ✅ Use o `usuario_id` do usuário tipo professor
- ❌ NÃO use o `professor_id` da tabela `professor`
- O sistema valida se o `usuario_id` existe e se é do tipo professor

## 🚀 Configuração Inicial

### 1. Importar a Coleção

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `POSTMAN_FREQUENCIA_COLLECTION.json`
4. A coleção será importada com todas as requisições prontas

### 2. Configurar Variáveis

Após importar, configure as variáveis da coleção:

1. Clique com botão direito na coleção → **Edit**
2. Vá na aba **Variables**
3. Configure os valores:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `baseUrl` | URL da API | `http://localhost:3003` |
| `token` | Token JWT (será preenchido automaticamente após login) | - |
| `professor_id` | UUID do professor (**na verdade é o `usuario_id` do usuário tipo professor**) | `123e4567-e89b-12d3-a456-426614174000` |
| `turma_id` | UUID da turma | `123e4567-e89b-12d3-a456-426614174001` |
| `matricula_aluno_id` | UUID da matrícula do aluno | `123e4567-e89b-12d3-a456-426614174002` |
| `aluno_id` | UUID do aluno | `123e4567-e89b-12d3-a456-426614174003` |
| `data_aula` | Data no formato YYYY-MM-DD | `2025-01-25` |

### 3. Obter Token de Autenticação

**IMPORTANTE**: Todas as requisições precisam de autenticação!

1. Execute a requisição **"🔐 1. Autenticação → Login"**
2. O token será salvo automaticamente na variável `{{token}}`
3. Todas as outras requisições usarão este token automaticamente

**Exemplo de Login**:
```json
POST /auth/login
{
  "email": "admin@escola.com",
  "senha": "123456"
}
```

**Resposta**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { ... }
}
```

---

## 📝 Endpoints Disponíveis

### ✅ **Métodos Recomendados (Novo Modelo)**

#### 1. Buscar Frequências por Professor, Turma e Data

```
GET /frequencia/professor/{professor_id}/turma/{turma_id}/data/{data}
```

**Exemplo**:
```
GET /frequencia/professor/123e4567-e89b-12d3-a456-426614174000/turma/123e4567-e89b-12d3-a456-426614174001/data/2025-01-25
```

**Resposta**:
```json
{
  "success": true,
  "data": [
    {
      "frequencia_id": "uuid",
      "matricula_aluno_id": "uuid",
      "ra": "2025001",
      "nome_aluno": "João",
      "sobrenome_aluno": "Silva",
      "presenca": true,
      "data_aula": "2025-01-25T00:00:00.000Z"
    }
  ],
  "message": "Frequências da data 2025-01-25 listadas com sucesso"
}
```

#### 2. Registrar Frequência em Lote (Recomendado)

```
POST /frequencia/lote-por-professor-turma-data
```

**Body**:
```json
{
  "professor_id": "123e4567-e89b-12d3-a456-426614174000",
  "turma_id": "123e4567-e89b-12d3-a456-426614174001",
  "data_aula": "2025-01-25",
  "frequencias": [
    {
      "matricula_aluno_id": "123e4567-e89b-12d3-a456-426614174002",
      "presenca": true
    },
    {
      "matricula_aluno_id": "123e4567-e89b-12d3-a456-426614174003",
      "presenca": false
    }
  ]
}
```

**⚠️ IMPORTANTE**: O campo `professor_id` na verdade é o `usuario_id` do usuário cadastrado como professor. Use o ID do usuário, não o `professor_id` da tabela professor.

**Características**:
- ✅ Faz **UPSERT**: atualiza se existir, cria se não existir
- ✅ Não precisa criar aula antes
- ✅ Mais simples e direto

**Resposta**:
```json
{
  "success": true,
  "data": [
    {
      "frequencia_id": "uuid",
      "professor_id": "uuid",
      "turma_id": "uuid",
      "data_aula": "2025-01-25T00:00:00.000Z",
      "matricula_aluno_id": "uuid",
      "presenca": true,
      "created_at": "2025-01-25T10:00:00.000Z",
      "updated_at": "2025-01-25T10:00:00.000Z"
    }
  ],
  "message": "Frequência em lote registrada com sucesso. Total: 2 registros"
}
```

---

### ⚠️ **Métodos Antigos (Compatibilidade)**

Estes métodos ainda funcionam, mas são mantidos apenas para compatibilidade:

- `GET /frequencia/data/{vinculacaoId}/{data}` - **DEPRECATED**
- `POST /frequencia/lote-por-data` - **DEPRECATED**

Use os métodos novos ao invés destes.

---

## 🧪 Fluxo de Teste Completo

### Passo 1: Login
```
POST /auth/login
→ Salva token automaticamente
```

### Passo 2: Buscar IDs Necessários

Antes de testar frequência, você precisa dos IDs:

**Buscar Usuário Professor**:
```
GET /usuarios
→ Filtre por tipo_usuario_id = 'professor' OU
GET /professor/com-turmas
→ Copie o usuario_id (que será usado como professor_id)
```

**⚠️ IMPORTANTE**: Use o `usuario_id` do usuário tipo professor, não o `professor_id` da tabela professor.

**Buscar Turma**:
```
GET /turma
→ Copie um turma_id
```

**Buscar Matrículas**:
```
GET /matricula-aluno/turma/{turma_id}
→ Copie os matricula_aluno_id
```

### Passo 3: Buscar Frequências Existentes

```
GET /frequencia/professor/{professor_id}/turma/{turma_id}/data/2025-01-25
```

**Se retornar dados**: Frequências já existem para este dia
**Se retornar vazio**: Não há frequências registradas ainda

### Passo 4: Registrar Frequência

```
POST /frequencia/lote-por-professor-turma-data
{
  "professor_id": "...",
  "turma_id": "...",
  "data_aula": "2025-01-25",
  "frequencias": [
    { "matricula_aluno_id": "...", "presenca": true },
    { "matricula_aluno_id": "...", "presenca": false }
  ]
}
```

### Passo 5: Verificar Criação

Execute novamente o passo 3 para verificar se as frequências foram criadas.

### Passo 6: Atualizar Frequência

```
PUT /frequencia/{frequencia_id}
{
  "presenca": false
}
```

### Passo 7: Ver Estatísticas

```
GET /frequencia/estatisticas/aluno/{aluno_id}
```

---

## 🔍 Exemplos Práticos

### Exemplo 1: Registrar Chamada Completa

**Cenário**: Professor registra presença de todos os alunos de uma turma em um dia específico.

1. **Buscar alunos da turma**:
   ```
   GET /matricula-aluno/turma/{turma_id}
   ```

2. **Registrar frequência em lote**:
   ```json
   POST /frequencia/lote-por-professor-turma-data
   {
     "professor_id": "prof-uuid",
     "turma_id": "turma-uuid",
     "data_aula": "2025-01-25",
     "frequencias": [
       { "matricula_aluno_id": "mat1", "presenca": true },
       { "matricula_aluno_id": "mat2", "presenca": true },
       { "matricula_aluno_id": "mat3", "presenca": false }
     ]
   }
   ```

3. **Verificar registro**:
   ```
   GET /frequencia/professor/{professor_id}/turma/{turma_id}/data/2025-01-25
   ```

### Exemplo 2: Corrigir Presença de um Aluno

**Cenário**: Aluno faltou mas foi marcado como presente por engano.

1. **Buscar frequência do aluno**:
   ```
   GET /frequencia/professor/{professor_id}/turma/{turma_id}/data/2025-01-25
   → Encontrar frequencia_id do aluno
   ```

2. **Atualizar presença**:
   ```json
   PUT /frequencia/{frequencia_id}
   {
     "presenca": false
   }
   ```

### Exemplo 3: Ver Estatísticas de Frequência

**Cenário**: Verificar percentual de presença de um aluno.

```
GET /frequencia/estatisticas/aluno/{aluno_id}
```

**Resposta**:
```json
{
  "success": true,
  "data": {
    "total_aulas": 50,
    "presencas": 45,
    "faltas": 5,
    "percentual_presenca": 90.00
  }
}
```

---

## ⚠️ Erros Comuns

### 401 Unauthorized
**Causa**: Token não fornecido ou inválido
**Solução**: Faça login novamente

### 404 Not Found
**Causa**: ID não encontrado (professor, turma, aluno, etc.)
**Solução**: 
- Verifique se os IDs estão corretos
- **Para professor_id**: Use o `usuario_id` do usuário tipo professor, não o `professor_id` da tabela professor
- Verifique se o usuário realmente é do tipo professor

### 409 Conflict
**Causa**: Tentativa de criar frequência duplicada
**Solução**: Use o método de lote que faz UPSERT automaticamente

### 400 Bad Request
**Causa**: Dados inválidos no body
**Solução**: Verifique:
- `presenca` deve ser `true` ou `false` (boolean)
- `data_aula` deve estar no formato `YYYY-MM-DD`
- Todos os IDs devem ser UUIDs válidos

---

## 📊 Estrutura de Dados

### Frequência Individual
```json
{
  "frequencia_id": "uuid",
  "professor_id": "uuid",
  "turma_id": "uuid",
  "data_aula": "2025-01-25T00:00:00.000Z",
  "matricula_aluno_id": "uuid",
  "presenca": true,
  "aula_id": "uuid (opcional)",
  "created_at": "2025-01-25T10:00:00.000Z",
  "updated_at": "2025-01-25T10:00:00.000Z"
}
```

### Frequência com Detalhes
```json
{
  "frequencia_id": "uuid",
  "matricula_aluno_id": "uuid",
  "ra": "2025001",
  "nome_aluno": "João",
  "sobrenome_aluno": "Silva",
  "nome_turma": "1º Ano A",
  "turno": "manha",
  "nome_disciplina": "Matemática",
  "nome_professor": "Maria Santos",
  "presenca": true,
  "data_aula": "2025-01-25T00:00:00.000Z"
}
```

---

## 🔐 Permissões

| Endpoint | ADMIN | SECRETARIO | PROFESSOR |
|----------|-------|------------|-----------|
| Listar/Buscar | ✅ | ✅ | ✅ |
| Criar | ✅ | ✅ | ✅ |
| Atualizar | ✅ | ✅ | ✅ |
| Deletar | ✅ | ✅ | ❌ |

---

## 💡 Dicas

1. **Use variáveis**: Configure as variáveis da coleção para facilitar os testes
2. **Teste em ordem**: Siga o fluxo sugerido acima
3. **Verifique respostas**: Sempre verifique o código de status e a mensagem
4. **Use o método novo**: Prefira `lote-por-professor-turma-data` ao invés dos métodos antigos
5. **UPSERT automático**: O método de lote atualiza automaticamente se já existir

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do servidor
2. Confirme que o token está válido
3. Verifique se os IDs existem no banco
4. Confirme as permissões do usuário

---

**Última atualização**: Janeiro 2025

