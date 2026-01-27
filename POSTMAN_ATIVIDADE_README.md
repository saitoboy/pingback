# 📝 Collection Postman - Avaliação (Atividade)

Coleção completa para testar todos os endpoints de Avaliação/Atividade do Sistema Escolar Pinguinho.

## 🚀 Como Usar

### 1. Importar a Collection

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `POSTMAN_ATIVIDADE_COLLECTION.json`
4. A collection será importada com todas as requisições organizadas

### 2. Configurar Variáveis

Após importar, configure as variáveis da collection:

- **baseUrl**: `http://localhost:3003` (ou sua URL de produção)
- **token**: Será preenchido automaticamente após o login
- **turma_disciplina_professor_id**: ID da vinculação turma/disciplina/professor
- **periodo_letivo_id**: ID do período letivo (obrigatório para criar atividades)
- **data_aula**: Data no formato YYYY-MM-DD (ex: `2025-12-23`)
- **atividade_id**: Será preenchido automaticamente após criar uma atividade
- **aula_id**: ID da aula (opcional, para modelo antigo)

### 3. Fazer Login

1. Execute a requisição **🔐 Autenticação > Login**
2. O token será salvo automaticamente na variável `{{token}}`
3. Todas as outras requisições usarão este token automaticamente

## 📋 Endpoints Disponíveis

### 🔐 Autenticação

- **POST /auth/login** - Fazer login e obter token JWT

### 📋 Listar e Buscar

- **GET /atividade** - Listar todas as atividades
- **GET /atividade/:atividade_id** - Buscar atividade por ID
- **GET /atividade/aula/:aula_id** - Buscar atividades por aula
- **GET /atividade/vinculacao/:turma_disciplina_professor_id** - Buscar atividades por vinculação
- **GET /atividade/data/:vinculacaoId/:data** ⭐ - Buscar por data e vinculação (usado pelo calendário)
- **GET /atividade/periodo/:periodo_letivo_id** - Buscar atividades por período letivo
- **GET /atividade/avaliativas** - Buscar atividades que valem nota
- **GET /atividade/detalhes/:atividade_id** - Buscar atividade com detalhes completos

### ➕ Criar Avaliação

- **POST /atividade** (com `turma_disciplina_professor_id` e `data_aula`) ⭐ - Criar avaliação com data (modelo recomendado)
- **POST /atividade** (com `aula_id`) - Criar avaliação com aula ID (modelo antigo)

### ✏️ Atualizar Avaliação

- **PUT /atividade/:atividade_id** - Atualizar avaliação existente

### 🗑️ Deletar Avaliação

- **DELETE /atividade/:atividade_id** - Deletar avaliação

### 📊 Estatísticas

- **GET /atividade/estatisticas/professor/:professor_id** - Estatísticas por professor

## ⭐ Endpoints Recomendados

### Buscar Atividades por Data e Vinculação

Este é o endpoint usado pelo calendário para buscar atividades do dia:

```
GET /atividade/data/:vinculacaoId/:data
```

**Parâmetros:**
- `vinculacaoId`: ID da vinculação (turma_disciplina_professor_id)
- `data`: Data no formato YYYY-MM-DD (ex: `2025-12-23`)

**Exemplo:**
```
GET /atividade/data/123e4567-e89b-12d3-a456-426614174000/2025-12-23
```

### Criar Avaliação com Data

Este é o modelo recomendado usado pelo calendário:

```json
{
  "turma_disciplina_professor_id": "123e4567-e89b-12d3-a456-426614174000",
  "data_aula": "2025-12-23",
  "titulo": "Prova Bimestral - Matemática",
  "descricao": "Avaliação sobre equações quadráticas e funções",
  "peso": 3,
  "vale_nota": true,
  "periodo_letivo_id": "uuid-do-periodo-letivo"
}
```

## 🔑 Permissões

- **ADMIN**: Pode criar, atualizar e deletar qualquer atividade
- **PROFESSOR**: Pode criar atividades e gerenciar apenas suas próprias atividades
- **SECRETÁRIO**: Pode apenas visualizar atividades (não pode criar/editar/deletar)

## 📝 Formato de Data

**Importante:** Sempre use o formato `YYYY-MM-DD` para datas:

- ✅ Correto: `2025-12-23`
- ❌ Incorreto: `23/12/2025` ou `12-23-2025`

## 🧪 Exemplos de Uso

### 1. Buscar Atividades do Dia 23 de Dezembro

1. Configure `turma_disciplina_professor_id` com o ID da vinculação
2. Configure `data_aula` como `2025-12-23`
3. Execute: **Buscar Atividades por Data e Vinculação**

### 2. Criar uma Nova Avaliação

1. Configure `turma_disciplina_professor_id`, `data_aula` e `periodo_letivo_id`
2. Execute: **Criar Avaliação com Data**
3. O `atividade_id` será salvo automaticamente

### 3. Atualizar uma Avaliação

1. Certifique-se de que `atividade_id` está configurado
2. Modifique o body da requisição com os novos dados
3. Execute: **Atualizar Avaliação**

### 4. Deletar uma Avaliação

1. Certifique-se de que `atividade_id` está configurado
2. Execute: **Deletar Avaliação**

## 🔍 Respostas Esperadas

### Sucesso (200/201)

```json
{
  "success": true,
  "message": "Atividade criada com sucesso",
  "data": {
    "atividade_id": "uuid",
    "turma_disciplina_professor_id": "uuid",
    "data_aula": "2025-12-23T00:00:00.000Z",
    "titulo": "Prova Bimestral - Matemática",
    "descricao": "Avaliação sobre equações quadráticas",
    "peso": 3,
    "vale_nota": true,
    "periodo_letivo_id": "uuid",
    "created_at": "2025-12-23T10:00:00.000Z",
    "updated_at": "2025-12-23T10:00:00.000Z"
  }
}
```

### Erro (400/401/403/500)

```json
{
  "success": false,
  "message": "Mensagem de erro descritiva"
}
```

## 💡 Dicas

1. **Token Automático**: O token é salvo automaticamente após o login
2. **ID Automático**: O `atividade_id` é salvo automaticamente após criar uma atividade
3. **Variáveis**: Use `{{variavel}}` para referenciar valores nas requisições
4. **Formato de Data**: Sempre use `YYYY-MM-DD` para evitar problemas de timezone
5. **Período Letivo**: É obrigatório ter um `periodo_letivo_id` válido para criar atividades

## 🐛 Troubleshooting

### Erro 401 (Não Autorizado)
- Verifique se fez login e o token está configurado
- Verifique se o token não expirou

### Erro 403 (Proibido)
- Verifique se seu usuário tem permissão (ADMIN ou PROFESSOR)
- Professores só podem editar/deletar suas próprias atividades

### Erro 400 (Bad Request)
- Verifique se todos os campos obrigatórios estão preenchidos
- Verifique o formato da data (deve ser YYYY-MM-DD)
- Verifique se os IDs são UUIDs válidos
- Verifique se o `periodo_letivo_id` é válido

### Atividade não aparece no calendário
- Verifique se a data está no formato correto (YYYY-MM-DD)
- Verifique se o `turma_disciplina_professor_id` está correto
- Verifique se a data corresponde ao dia selecionado no calendário

## 📚 Campos da Atividade

### Campos Obrigatórios para Criar

- `turma_disciplina_professor_id`: ID da vinculação (UUID)
- `data_aula`: Data no formato YYYY-MM-DD
- `titulo`: Título da avaliação (máximo 255 caracteres)
- `descricao`: Descrição detalhada
- `peso`: Peso da avaliação (número positivo)
- `vale_nota`: true ou false
- `periodo_letivo_id`: ID do período letivo (UUID)

### Campos Opcionais

- `aula_id`: ID da aula (para compatibilidade com modelo antigo)

## 📚 Documentação Adicional

Para mais informações sobre a API, consulte:
- Rotas: `pingback/src/routes/atividade.routes.ts`
- Controller: `pingback/src/controllers/atividade.controller.ts`
- Service: `pingback/src/services/atividade.service.ts`
- Model: `pingback/src/model/atividade.model.ts`

