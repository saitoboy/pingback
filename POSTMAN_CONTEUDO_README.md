# 📚 Collection Postman - Conteúdo de Aula

Coleção completa para testar todos os endpoints de Conteúdo de Aula do Sistema Escolar Pinguinho.

## 🚀 Como Usar

### 1. Importar a Collection

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `POSTMAN_CONTEUDO_COLLECTION.json`
4. A collection será importada com todas as requisições organizadas

### 2. Configurar Variáveis

Após importar, configure as variáveis da collection:

- **baseUrl**: `http://localhost:3003` (ou sua URL de produção)
- **token**: Será preenchido automaticamente após o login
- **turma_disciplina_professor_id**: ID da vinculação turma/disciplina/professor
- **data_aula**: Data no formato YYYY-MM-DD (ex: `2025-12-23`)
- **conteudo_aula_id**: Será preenchido automaticamente após criar um conteúdo
- **aula_id**: ID da aula (opcional, para modelo antigo)

### 3. Fazer Login

1. Execute a requisição **🔐 Autenticação > Login**
2. O token será salvo automaticamente na variável `{{token}}`
3. Todas as outras requisições usarão este token automaticamente

## 📋 Endpoints Disponíveis

### 🔐 Autenticação

- **POST /auth/login** - Fazer login e obter token JWT

### 📋 Listar e Buscar

- **GET /conteudo-aula** - Listar todos os conteúdos
- **GET /conteudo-aula/:id** - Buscar conteúdo por ID
- **GET /conteudo-aula/aula/:aula_id** - Buscar conteúdos por aula
- **GET /conteudo-aula/data/:vinculacaoId/:data** ⭐ - Buscar por data e vinculação (usado pelo calendário)

### ➕ Criar Conteúdo

- **POST /conteudo-aula** (com `turma_disciplina_professor_id` e `data_aula`) ⭐ - Criar conteúdo com data (modelo recomendado)
- **POST /conteudo-aula** (com `aula_id`) - Criar conteúdo com aula ID (modelo antigo)

### ✏️ Atualizar Conteúdo

- **PUT /conteudo-aula/:id** - Atualizar conteúdo existente

### 🗑️ Deletar Conteúdo

- **DELETE /conteudo-aula/:id** - Deletar conteúdo

## ⭐ Endpoints Recomendados

### Buscar Conteúdos por Data e Vinculação

Este é o endpoint usado pelo calendário para buscar conteúdos do dia:

```
GET /conteudo-aula/data/:vinculacaoId/:data
```

**Parâmetros:**
- `vinculacaoId`: ID da vinculação (turma_disciplina_professor_id)
- `data`: Data no formato YYYY-MM-DD (ex: `2025-12-23`)

**Exemplo:**
```
GET /conteudo-aula/data/123e4567-e89b-12d3-a456-426614174000/2025-12-23
```

### Criar Conteúdo com Data

Este é o modelo recomendado usado pelo calendário:

```json
{
  "turma_disciplina_professor_id": "123e4567-e89b-12d3-a456-426614174000",
  "data_aula": "2025-12-23",
  "descricao": "Capítulo 5 - Equações Quadráticas",
  "conteudo": "Nesta aula abordamos os seguintes tópicos:\n\n1. Definição de equações quadráticas\n2. Fórmula de Bhaskara\n3. Resolução de exercícios práticos"
}
```

## 🔑 Permissões

- **ADMIN**: Pode criar, atualizar e deletar qualquer conteúdo
- **PROFESSOR**: Pode criar conteúdos e gerenciar apenas seus próprios conteúdos
- **SECRETÁRIO**: Não tem permissão para criar/editar/deletar conteúdos

## 📝 Formato de Data

**Importante:** Sempre use o formato `YYYY-MM-DD` para datas:

- ✅ Correto: `2025-12-23`
- ❌ Incorreto: `23/12/2025` ou `12-23-2025`

## 🧪 Exemplos de Uso

### 1. Buscar Conteúdos do Dia 23 de Dezembro

1. Configure `turma_disciplina_professor_id` com o ID da vinculação
2. Configure `data_aula` como `2025-12-23`
3. Execute: **Buscar Conteúdos por Data e Vinculação**

### 2. Criar um Novo Conteúdo

1. Configure `turma_disciplina_professor_id` e `data_aula`
2. Execute: **Criar Conteúdo com Data**
3. O `conteudo_aula_id` será salvo automaticamente

### 3. Atualizar um Conteúdo

1. Certifique-se de que `conteudo_aula_id` está configurado
2. Modifique o body da requisição com os novos dados
3. Execute: **Atualizar Conteúdo**

### 4. Deletar um Conteúdo

1. Certifique-se de que `conteudo_aula_id` está configurado
2. Execute: **Deletar Conteúdo**

## 🔍 Respostas Esperadas

### Sucesso (200/201)

```json
{
  "sucesso": true,
  "mensagem": "Conteúdo criado com sucesso",
  "dados": {
    "conteudo_aula_id": "uuid",
    "turma_disciplina_professor_id": "uuid",
    "data_aula": "2025-12-23T00:00:00.000Z",
    "descricao": "Capítulo 5 - Equações Quadráticas",
    "conteudo": "Nesta aula abordamos...",
    "created_at": "2025-12-23T10:00:00.000Z",
    "updated_at": "2025-12-23T10:00:00.000Z"
  }
}
```

### Erro (400/401/403/500)

```json
{
  "sucesso": false,
  "mensagem": "Mensagem de erro descritiva"
}
```

## 💡 Dicas

1. **Token Automático**: O token é salvo automaticamente após o login
2. **ID Automático**: O `conteudo_aula_id` é salvo automaticamente após criar um conteúdo
3. **Variáveis**: Use `{{variavel}}` para referenciar valores nas requisições
4. **Formato de Data**: Sempre use `YYYY-MM-DD` para evitar problemas de timezone

## 🐛 Troubleshooting

### Erro 401 (Não Autorizado)
- Verifique se fez login e o token está configurado
- Verifique se o token não expirou

### Erro 403 (Proibido)
- Verifique se seu usuário tem permissão (ADMIN ou PROFESSOR)
- Professores só podem editar/deletar seus próprios conteúdos

### Erro 400 (Bad Request)
- Verifique se todos os campos obrigatórios estão preenchidos
- Verifique o formato da data (deve ser YYYY-MM-DD)
- Verifique se os IDs são UUIDs válidos

### Conteúdo não aparece no calendário
- Verifique se a data está no formato correto (YYYY-MM-DD)
- Verifique se o `turma_disciplina_professor_id` está correto
- Verifique se a data corresponde ao dia selecionado no calendário

## 📚 Documentação Adicional

Para mais informações sobre a API, consulte:
- Rotas: `pingback/src/routes/conteudoAula.routes.ts`
- Controller: `pingback/src/controllers/conteudoAula.controller.ts`
- Service: `pingback/src/services/conteudoAula.service.ts`
- Model: `pingback/src/model/conteudoAula.model.ts`

