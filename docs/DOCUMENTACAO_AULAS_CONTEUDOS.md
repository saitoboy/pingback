# 📚 Documentação Completa - CRUD de Aula e Conteúdo de Aula

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [API de Aulas](#api-de-aulas)
4. [API de Conteúdo de Aula](#api-de-conteúdo-de-aula)
5. [Permissões e Segurança](#permissões-e-segurança)
6. [Casos de Uso Práticos](#casos-de-uso-práticos)
7. [Validações e Regras de Negócio](#validações-e-regras-de-negócio)
8. [Exemplos de Integração](#exemplos-de-integração)
9. [Códigos de Erro](#códigos-de-erro)
10. [Testes e Validação](#testes-e-validação)

---

## 🎯 Visão Geral

O sistema de aulas e conteúdos permite que professores criem, editem e gerenciem:
- **Aulas**: Horários e datas de encontros pedagógicos
- **Conteúdos**: Material didático e planejamento das aulas

### Arquitetura
```
Professor → Vinculação (Turma + Disciplina) → Aula → Conteúdo
```

### Hierarquia de Dados
```
Usuario (professor)
└── TurmaDisciplinaProfessor (vinculação)
    └── Aula
        └── ConteudoAula (1:N)
```

---

## ⚡ Pré-requisitos

### 1. Autenticação Necessária
- Token JWT válido
- Usuário do tipo `PROFESSOR`, `ADMIN` ou `SECRETARIO`

### 2. Dados Necessários
- **Vinculação ativa**: Professor deve estar vinculado à turma e disciplina
- **Ano letivo ativo**: Sistema deve ter ano letivo configurado
- **Turma e disciplina existentes**

### 3. Estrutura de Vinculação
```json
{
  "turma_disciplina_professor_id": "uuid",
  "turma_id": "uuid",
  "disciplina_id": "uuid", 
  "professor_id": "uuid",
  "nome_turma": "1º Ano A",
  "nome_disciplina": "Matemática",
  "nome_professor": "Prof. João Silva"
}
```

---

## 📝 API de Aulas

### Base URL: `/api/aula`

### 🔍 **1. Listar Todas as Aulas**

**Endpoint:** `GET /api/aula`
**Permissões:** ADMIN, SECRETARIO, PROFESSOR
**Autenticação:** Obrigatória

**Resposta:**
```json
{
  "success": true,
  "message": "N aulas encontradas",
  "data": [
    {
      "aula_id": "uuid",
      "turma_disciplina_professor_id": "uuid",
      "data_aula": "2025-08-12T00:00:00.000Z",
      "hora_inicio": "08:30:00",
      "hora_fim": "09:30:00",
      "nome_turma": "1º Ano A",
      "nome_disciplina": "Matemática",
      "nome_professor": "Prof. João Silva",
      "email_professor": "joao@escola.com",
      "created_at": "2025-08-11T19:13:36.088Z",
      "updated_at": "2025-08-11T19:19:09.271Z"
    }
  ]
}
```

---

### 🔍 **2. Buscar Aula por ID**

**Endpoint:** `GET /api/aula/{aula_id}`
**Permissões:** ADMIN, SECRETARIO, PROFESSOR
**Autenticação:** Obrigatória

**Exemplo:** `GET /api/aula/1eb130f5-818e-4b36-b454-665602028197`

**Resposta:**
```json
{
  "success": true,
  "message": "Aula encontrada",
  "data": {
    "aula_id": "1eb130f5-818e-4b36-b454-665602028197",
    "turma_disciplina_professor_id": "deefe7f0-8ff8-4d77-999a-9a07ca428f72",
    "data_aula": "2025-08-12T00:00:00.000Z",
    "hora_inicio": "08:30:00",
    "hora_fim": "09:30:00",
    "nome_turma": "1º Ano A",
    "nome_disciplina": "Matemática",
    "nome_professor": "Prof. João Silva",
    "email_professor": "joao@escola.com",
    "created_at": "2025-08-11T19:13:36.088Z",
    "updated_at": "2025-08-11T19:19:09.271Z"
  }
}
```

---

### 🔍 **3. Buscar Aulas por Vinculação**

**Endpoint:** `GET /api/aula/vinculacao/{turma_disciplina_professor_id}`
**Permissões:** ADMIN, SECRETARIO, PROFESSOR
**Autenticação:** Obrigatória

**Uso:** Listar todas as aulas de uma vinculação específica

**Exemplo:** `GET /api/aula/vinculacao/deefe7f0-8ff8-4d77-999a-9a07ca428f72`

---

### 🔍 **4. Buscar Aulas por Data**

**Endpoint:** `GET /api/aula/data/{data}`
**Permissões:** ADMIN, SECRETARIO, PROFESSOR
**Autenticação:** Obrigatória

**Formato da data:** `YYYY-MM-DD`
**Exemplo:** `GET /api/aula/data/2025-08-12`

**Uso:** Agenda diária, cronograma de aulas

---

### ➕ **5. Criar Nova Aula**

**Endpoint:** `POST /api/aula`
**Permissões:** ADMIN, SECRETARIO, PROFESSOR
**Autenticação:** Obrigatória

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "turma_disciplina_professor_id": "deefe7f0-8ff8-4d77-999a-9a07ca428f72",
  "data_aula": "2025-08-12",
  "hora_inicio": "08:00",
  "hora_fim": "09:00"
}
```

**Validações:**
- ✅ Vinculação deve existir
- ✅ Professor deve estar vinculado à vinculação (se for PROFESSOR)
- ✅ Não pode haver conflito de horário na mesma vinculação e data
- ✅ Data deve estar no formato YYYY-MM-DD
- ✅ Horários devem estar no formato HH:MM
- ✅ Hora fim deve ser maior que hora início

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Aula criada com sucesso",
  "data": {
    "aula_id": "uuid-gerado",
    "turma_disciplina_professor_id": "deefe7f0-8ff8-4d77-999a-9a07ca428f72",
    "data_aula": "2025-08-12T00:00:00.000Z",
    "hora_inicio": "08:00:00",
    "hora_fim": "09:00:00",
    "created_at": "2025-08-11T19:13:36.088Z",
    "updated_at": "2025-08-11T19:13:36.088Z"
  }
}
```

---

### ✏️ **6. Atualizar Aula**

**Endpoint:** `PUT /api/aula/{aula_id}`
**Permissões:** ADMIN, SECRETARIO, PROFESSOR
**Segurança:** Professor só pode atualizar suas próprias aulas
**Autenticação:** Obrigatória

**Body (campos opcionais):**
```json
{
  "data_aula": "2025-08-13",
  "hora_inicio": "09:00",
  "hora_fim": "10:00"
}
```

**Validações:**
- ✅ Aula deve existir
- ✅ Professor deve ser proprietário da aula (se for PROFESSOR)
- ✅ Não pode alterar turma_disciplina_professor_id
- ✅ Não pode haver conflito de horário se alterar data/horários

**Resposta:**
```json
{
  "success": true,
  "message": "Aula atualizada com sucesso",
  "data": {
    "aula_id": "uuid",
    "updated_at": "2025-08-11T19:25:00.000Z"
    // ... outros campos
  }
}
```

---

### 🗑️ **7. Deletar Aula**

**Endpoint:** `DELETE /api/aula/{aula_id}`
**Permissões:** ADMIN, PROFESSOR
**Segurança:** Professor só pode deletar suas próprias aulas
**Autenticação:** Obrigatória

**Validações:**
- ✅ Aula deve existir
- ✅ Professor deve ser proprietário da aula (se for PROFESSOR)
- ✅ Não pode ter conteúdos vinculados

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Aula deletada com sucesso"
}
```

**Erro se tiver conteúdos:**
```json
{
  "success": false,
  "message": "Não é possível excluir aula que possui conteúdos registrados",
  "error": "Não é possível excluir aula que possui conteúdos registrados"
}
```

---

## 📖 API de Conteúdo de Aula

### Base URL: `/api/conteudo-aula`

### 🔍 **1. Listar Todos os Conteúdos**

**Endpoint:** `GET /api/conteudo-aula`
**Permissões:** ADMIN, SECRETARIO, PROFESSOR
**Autenticação:** Obrigatória

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Lista de conteúdos de aula obtida com sucesso",
  "dados": [
    {
      "conteudo_aula_id": "uuid",
      "aula_id": "uuid",
      "descricao": "Introdução aos números naturais",
      "conteudo": "Conteúdo detalhado da aula...",
      "created_at": "2025-08-11T19:15:53.660Z",
      "updated_at": "2025-08-11T19:20:13.469Z"
    }
  ],
  "total": 1
}
```

---

### 🔍 **2. Buscar Conteúdo por ID**

**Endpoint:** `GET /api/conteudo-aula/{conteudo_id}`
**Permissões:** ADMIN, SECRETARIO, PROFESSOR
**Autenticação:** Obrigatória

---

### 🔍 **3. Buscar Conteúdos por Aula**

**Endpoint:** `GET /api/conteudo-aula/aula/{aula_id}`
**Permissões:** ADMIN, SECRETARIO, PROFESSOR
**Autenticação:** Obrigatória

**Uso:** Listar todos os conteúdos de uma aula específica

**Exemplo:** `GET /api/conteudo-aula/aula/1eb130f5-818e-4b36-b454-665602028197`

---

### ➕ **4. Criar Conteúdo de Aula**

**Endpoint:** `POST /api/conteudo-aula`
**Permissões:** ADMIN, PROFESSOR (SEM SECRETARIO)
**Autenticação:** Obrigatória

**Body:**
```json
{
  "aula_id": "1eb130f5-818e-4b36-b454-665602028197",
  "descricao": "Introdução aos números naturais",
  "conteudo": "📚 PLANO DE AULA\n\n1. OBJETIVOS:\n   - Compreender números naturais\n   - Realizar operações básicas\n   - Desenvolver raciocínio lógico\n\n2. CONTEÚDO PROGRAMÁTICO:\n   - Definição de números naturais\n   - Sequência numérica (0, 1, 2, 3...)\n   - Comparação entre números\n   - Adição e subtração simples\n\n3. METODOLOGIA:\n   - Aula expositiva dialogada\n   - Uso de material concreto\n   - Exercícios práticos\n   - Atividades em grupo\n\n4. RECURSOS:\n   - Quadro e giz\n   - Material dourado\n   - Livro didático páginas 15-20\n   - Jogos educativos\n\n5. AVALIAÇÃO:\n   - Participação em sala\n   - Resolução de exercícios\n   - Observação do desenvolvimento\n\n6. LIÇÃO DE CASA:\n   - Exercícios páginas 21-23\n   - Pesquisa sobre história dos números"
}
```

**Validações:**
- ✅ Aula deve existir
- ✅ Professor deve ser proprietário da aula (se for PROFESSOR)
- ✅ Descrição é obrigatória (máximo 255 caracteres)
- ✅ Conteúdo é obrigatório

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Conteúdo de aula criado com sucesso",
  "dados": {
    "conteudo_aula_id": "uuid-gerado",
    "aula_id": "1eb130f5-818e-4b36-b454-665602028197",
    "descricao": "Introdução aos números naturais",
    "conteudo": "📚 PLANO DE AULA...",
    "created_at": "2025-08-11T19:15:53.660Z",
    "updated_at": "2025-08-11T19:15:53.660Z"
  }
}
```

---

### ✏️ **5. Atualizar Conteúdo**

**Endpoint:** `PUT /api/conteudo-aula/{conteudo_id}`
**Permissões:** ADMIN, PROFESSOR
**Segurança:** Professor só pode atualizar conteúdos de suas aulas
**Autenticação:** Obrigatória

**Body (pelo menos um campo):**
```json
{
  "descricao": "Introdução aos números naturais (REVISADO)",
  "conteudo": "📚 PLANO DE AULA ATUALIZADO\n\n..."
}
```

---

### 🗑️ **6. Deletar Conteúdo**

**Endpoint:** `DELETE /api/conteudo-aula/{conteudo_id}`
**Permissões:** ADMIN, PROFESSOR
**Segurança:** Professor só pode deletar conteúdos de suas aulas
**Autenticação:** Obrigatória

---

## 🔒 Permissões e Segurança

### Matriz de Permissões

| Operação | ADMIN | SECRETARIO | PROFESSOR |
|----------|-------|------------|-----------|
| 👀 **Aulas - Listar/Buscar** | ✅ Todas | ✅ Todas | ✅ Todas |
| ➕ **Aulas - Criar** | ✅ Qualquer | ✅ Qualquer | ✅ Suas vinculações |
| ✏️ **Aulas - Editar** | ✅ Qualquer | ✅ Qualquer | ✅ Suas próprias |
| 🗑️ **Aulas - Deletar** | ✅ Qualquer | ❌ Não | ✅ Suas próprias |
| 👀 **Conteúdos - Listar/Buscar** | ✅ Todos | ✅ Todos | ✅ Todos |
| ➕ **Conteúdos - Criar** | ✅ Qualquer | ❌ Não | ✅ Suas aulas |
| ✏️ **Conteúdos - Editar** | ✅ Qualquer | ❌ Não | ✅ Suas aulas |
| 🗑️ **Conteúdos - Deletar** | ✅ Qualquer | ❌ Não | ✅ Suas aulas |

### Validações de Propriedade

**Para PROFESSOR:**
- ✅ Só pode criar aulas em suas vinculações
- ✅ Só pode editar/deletar suas próprias aulas
- ✅ Só pode criar/editar/deletar conteúdos de suas aulas

**Verificação automática:**
```typescript
// Exemplo de verificação no controller
if (usuario.tipo_usuario_id === TipoUsuario.PROFESSOR) {
  const temAcesso = await AulaService.verificarAcessoProfessor(aula_id, usuario.usuario_id);
  if (!temAcesso) {
    return res.status(403).json({
      success: false,
      message: 'Você só pode atualizar suas próprias aulas'
    });
  }
}
```

---

## 🎯 Casos de Uso Práticos

### 1. **Planejamento Semanal de Aulas**

```javascript
// 1. Buscar vinculações do professor
GET /api/turma-disciplina-professor

// 2. Criar aulas da semana
POST /api/aula
{
  "turma_disciplina_professor_id": "uuid",
  "data_aula": "2025-08-12",
  "hora_inicio": "08:00",
  "hora_fim": "09:00"
}

// 3. Adicionar conteúdo para cada aula
POST /api/conteudo-aula
{
  "aula_id": "uuid-da-aula",
  "descricao": "Aula 1 - Introdução",
  "conteudo": "Plano detalhado..."
}
```

### 2. **Agenda Diária do Professor**

```javascript
// Buscar todas as aulas de hoje
GET /api/aula/data/2025-08-12

// Para cada aula, buscar os conteúdos
GET /api/conteudo-aula/aula/{aula_id}
```

### 3. **Relatório de Aulas por Disciplina**

```javascript
// Buscar aulas de uma vinculação específica
GET /api/aula/vinculacao/{turma_disciplina_professor_id}
```

### 4. **Backup e Versionamento de Conteúdos**

```javascript
// 1. Criar versão inicial
POST /api/conteudo-aula

// 2. Atualizar com nova versão
PUT /api/conteudo-aula/{id}

// 3. Histórico através de timestamps
// created_at e updated_at registram as mudanças
```

---

## ⚠️ Validações e Regras de Negócio

### 📅 **Validações de Data e Horário**

1. **Formato de Data:** `YYYY-MM-DD`
2. **Formato de Horário:** `HH:MM`
3. **Hora fim > Hora início**
4. **Sem conflitos de horário:** Na mesma vinculação e data

**Conflitos detectados:**
- Nova aula começa durante aula existente
- Nova aula termina durante aula existente  
- Nova aula engloba aula existente

### 🔗 **Integridade Referencial**

1. **Aula → Vinculação:** Deve existir
2. **Conteúdo → Aula:** Deve existir
3. **Deleção em cascata:** Aula com conteúdos não pode ser deletada

### 📏 **Limites de Texto**

1. **Descrição do conteúdo:** Máximo 255 caracteres
2. **Conteúdo:** Texto longo (sem limite prático)
3. **Validação de campos obrigatórios**

---

## 🔧 Exemplos de Integração

### Frontend React - Criar Aula

```jsx
const criarAula = async (dadosAula) => {
  try {
    const response = await fetch('/api/aula', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAula)
    });
    
    const resultado = await response.json();
    
    if (resultado.success) {
      console.log('Aula criada:', resultado.data);
      // Criar conteúdo da aula
      await criarConteudo(resultado.data.aula_id);
    }
  } catch (error) {
    console.error('Erro ao criar aula:', error);
  }
};
```

### Mobile Flutter - Agenda do Dia

```dart
Future<List<Aula>> buscarAulasDoDia(DateTime data) async {
  final dataFormatada = DateFormat('yyyy-MM-dd').format(data);
  
  final response = await http.get(
    Uri.parse('$baseUrl/api/aula/data/$dataFormatada'),
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    },
  );
  
  if (response.statusCode == 200) {
    final resultado = json.decode(response.body);
    return resultado['data']
        .map<Aula>((json) => Aula.fromJson(json))
        .toList();
  }
  
  throw Exception('Erro ao buscar aulas');
}
```

---

## ❌ Códigos de Erro

### HTTP Status Codes

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| **200** | ✅ Sucesso | Operação realizada com sucesso |
| **201** | ✅ Criado | Recurso criado com sucesso |
| **400** | ❌ Bad Request | Dados inválidos, conflito de horário |
| **401** | ❌ Unauthorized | Token inválido ou ausente |
| **403** | ❌ Forbidden | Sem permissão para a operação |
| **404** | ❌ Not Found | Recurso não encontrado |
| **500** | ❌ Server Error | Erro interno do servidor |

### Mensagens de Erro Específicas

```json
// Conflito de horário
{
  "success": false,
  "message": "Conflito de horário: já existe aula das 08:00 às 09:00 nesta data"
}

// Permissão negada
{
  "success": false,
  "message": "Você só pode atualizar suas próprias aulas"
}

// Vinculação não encontrada
{
  "success": false,
  "message": "Vinculação professor-turma-disciplina não encontrada"
}

// Aula com conteúdos
{
  "success": false,
  "message": "Não é possível excluir aula que possui conteúdos registrados"
}
```

---

## 🧪 Testes e Validação

### Checklist de Testes

#### ✅ **Testes de CRUD - Aulas**
- [ ] Criar aula válida
- [ ] Criar aula com conflito de horário (deve falhar)
- [ ] Editar aula própria (professor)
- [ ] Tentar editar aula de outro professor (deve falhar)
- [ ] Deletar aula sem conteúdos
- [ ] Tentar deletar aula com conteúdos (deve falhar)
- [ ] Buscar aula por ID
- [ ] Listar aulas com filtros

#### ✅ **Testes de CRUD - Conteúdos**
- [ ] Criar conteúdo para aula própria
- [ ] Tentar criar conteúdo para aula de outro professor (deve falhar)
- [ ] Editar conteúdo próprio
- [ ] Deletar conteúdo próprio
- [ ] Buscar conteúdos por aula

#### ✅ **Testes de Permissões**
- [ ] ADMIN pode fazer tudo
- [ ] SECRETARIO pode gerenciar aulas, mas não conteúdos
- [ ] PROFESSOR só pode gerenciar seus próprios recursos

#### ✅ **Testes de Validação**
- [ ] Datas inválidas
- [ ] Horários inválidos
- [ ] Campos obrigatórios
- [ ] Limites de caracteres

### Postman Collection

```json
{
  "info": {
    "name": "Sistema Escolar - Aulas e Conteúdos",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email_usuario\": \"professor@escola.com\",\n  \"senha_usuario\": \"senha123\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Aulas",
      "item": [
        {
          "name": "Criar Aula",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/aula",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"turma_disciplina_professor_id\": \"uuid\",\n  \"data_aula\": \"2025-08-12\",\n  \"hora_inicio\": \"08:00\",\n  \"hora_fim\": \"09:00\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🏆 Conclusão

O sistema de aulas e conteúdos oferece:

✅ **CRUD completo** para aulas e conteúdos  
✅ **Segurança robusta** com verificação de propriedade  
✅ **Validações de negócio** para evitar conflitos  
✅ **API RESTful** bem documentada  
✅ **Flexibilidade** para diferentes tipos de usuário  
✅ **Integridade de dados** garantida  

### Próximos Passos Sugeridos

1. **Implementar notificações** quando aulas são criadas/alteradas
2. **Adicionar filtros avançados** (por período, professor, disciplina)
3. **Relatórios e estatísticas** de aulas ministradas
4. **Integração com calendário** (iCal, Google Calendar)
5. **Versionamento de conteúdos** com histórico de mudanças
6. **Templates de conteúdo** para agilizar criação
7. **Upload de arquivos** anexos aos conteúdos

---

*📝 Documentação criada em: 11 de agosto de 2025*  
*🔄 Versão: 1.0*  
*👨‍💻 Sistema: Escola Pinguinho API*
