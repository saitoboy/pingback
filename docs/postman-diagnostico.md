# 🧠 Testes Postman - Diagnóstico

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

## 🧠 Endpoints de Diagnóstico

### 🧪 Teste Simples - Campos Mínimos
```
POST http://localhost:3003/diagnostico
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "uuid-do-aluno",
  "cegueira": false,
  "baixa_visao": false,
  "surdez": false,
  "deficiencia_auditiva": false,
  "surdocegueira": false,
  "deficiencia_fisica": false,
  "deficiencia_multipla": false,
  "deficiencia_intelectual": false,
  "sindrome_down": false,
  "altas_habilidades": false,
  "tea": false,
  "alteracoes_processamento_auditivo": false,
  "tdah": false
}
```

### 📝 JSON COMPLETO - Criação de Diagnóstico
```json
{
  "aluno_id": "uuid-do-aluno",
  "cegueira": false,
  "baixa_visao": true,
  "surdez": false,
  "deficiencia_auditiva": false,
  "surdocegueira": false,
  "deficiencia_fisica": false,
  "deficiencia_multipla": false,
  "deficiencia_intelectual": false,
  "sindrome_down": false,
  "altas_habilidades": false,
  "tea": false,
  "alteracoes_processamento_auditivo": false,
  "tdah": false,
  "outros_diagnosticos": "Baixa visão congênita"
}
```

### 🧪 Diagnóstico TEA + TDAH
```json
{
  "aluno_id": "1f60eb87-efde-4a4f-860f-8e7575b3e4cd",
  "cegueira": false,
  "baixa_visao": false,
  "surdez": false,
  "deficiencia_auditiva": false,
  "surdocegueira": false,
  "deficiencia_fisica": false,
  "deficiencia_multipla": false,
  "deficiencia_intelectual": false,
  "sindrome_down": false,
  "altas_habilidades": false,
  "tea": true,
  "alteracoes_processamento_auditivo": false,
  "tdah": true,
  "outros_diagnosticos": "TEA nível 1 com TDAH combinado"
}
```

### 🧪 Altas Habilidades
```json
{
  "aluno_id": "1f60eb87-efde-4a4f-860f-8e7575b3e4cd",
  "cegueira": false,
  "baixa_visao": false,
  "surdez": false,
  "deficiencia_auditiva": false,
  "surdocegueira": false,
  "deficiencia_fisica": false,
  "deficiencia_multipla": false,
  "deficiencia_intelectual": false,
  "sindrome_down": false,
  "altas_habilidades": true,
  "tea": false,
  "alteracoes_processamento_auditivo": false,
  "tdah": false,
  "outros_diagnosticos": "Superdotação em matemática e ciências"
}
```

### 2. 📋 Listar Todos os Diagnósticos
```
GET http://localhost:3003/diagnostico
Authorization: Bearer SEU_TOKEN_AQUI
```

### 3. 🔍 Buscar Diagnóstico por ID
```
GET http://localhost:3003/diagnostico/ID_DO_DIAGNOSTICO
Authorization: Bearer SEU_TOKEN_AQUI
```

### 4. 👶 Buscar Diagnóstico por Aluno
```
GET http://localhost:3003/diagnostico/aluno/ID_DO_ALUNO
Authorization: Bearer SEU_TOKEN_AQUI
```

### 5. ✏️ Atualizar Diagnóstico
```
PUT http://localhost:3003/diagnostico/ID_DO_DIAGNOSTICO
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "tea": true,
  "tdah": false,
  "outros_diagnosticos": "TEA nível 2 - necessita apoio substancial"
}
```

### 6. 🗑️ Deletar Diagnóstico
```
DELETE http://localhost:3003/diagnostico/ID_DO_DIAGNOSTICO
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🧪 Testes de Validação

### Teste 1: Campos Obrigatórios
```
POST http://localhost:3003/diagnostico
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "",
  "cegueira": "",
  "baixa_visao": ""
}
```
**Resultado esperado:** Erro 400 com lista de campos obrigatórios

### Teste 2: Campo outros_diagnosticos Muito Longo
```
POST http://localhost:3003/diagnostico
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "uuid-valido",
  "cegueira": false,
  "baixa_visao": false,
  "surdez": false,
  "deficiencia_auditiva": false,
  "surdocegueira": false,
  "deficiencia_fisica": false,
  "deficiencia_multipla": false,
  "deficiencia_intelectual": false,
  "sindrome_down": false,
  "altas_habilidades": false,
  "tea": false,
  "alteracoes_processamento_auditivo": false,
  "tdah": false,
  "outros_diagnosticos": "TEXTO_COM_MAIS_DE_500_CARACTERES..."
}
```
**Resultado esperado:** Erro 400 - Campo muito longo

### Teste 3: Diagnóstico Duplicado
```
POST http://localhost:3003/diagnostico
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "ID_QUE_JA_TEM_DIAGNOSTICO",
  "cegueira": false,
  "baixa_visao": false,
  "surdez": false,
  "deficiencia_auditiva": false,
  "surdocegueira": false,
  "deficiencia_fisica": false,
  "deficiencia_multipla": false,
  "deficiencia_intelectual": false,
  "sindrome_down": false,
  "altas_habilidades": false,
  "tea": false,
  "alteracoes_processamento_auditivo": false,
  "tdah": false
}
```
**Resultado esperado:** Erro 409 - Diagnóstico já cadastrado

---

## 📚 Preparação dos Dados

### Primeiro, você precisa ter:

1. **Um aluno cadastrado** - Use este endpoint para criar ou listar:
```
GET http://localhost:3003/aluno
Authorization: Bearer SEU_TOKEN_AQUI
```

2. **IDs necessários** - Pegar ID de um aluno existente

---

## ✅ Fluxo de Teste Recomendado

1. **Login** → Pegar token
2. **Listar alunos** → Pegar ID de um aluno
3. **Criar diagnóstico** → Para o aluno escolhido
4. **Listar diagnósticos** → Verificar se criou
5. **Buscar por ID** → Testar busca específica
6. **Buscar por aluno** → Testar busca por aluno
7. **Atualizar** → Modificar alguns campos
8. **Tentar criar duplicado** → Testar validação
9. **Deletar** → Remover diagnóstico

---

## 🚨 Códigos de Resposta Esperados

- **200** - Sucesso (GET, PUT, DELETE)
- **201** - Criado com sucesso (POST)
- **400** - Dados inválidos (validação)
- **401** - Não autenticado (sem token)
- **403** - Sem permissão (não é ADMIN/SECRETARIO)
- **404** - Não encontrado
- **409** - Conflito (diagnóstico duplicado)
- **500** - Erro interno

---

## 💡 Dicas

1. **Sempre use o token** obtido no login
2. **Copie os IDs** das respostas para usar nos próximos testes
3. **Teste as validações** para garantir que funcionam
4. **Campos booleanos** devem ser `true` ou `false`, não strings
5. **Um aluno = um diagnóstico** - validação de unicidade
6. **Campo outros_diagnosticos** é opcional, mas limitado a 500 caracteres

---

## 🔍 Casos de Uso Comuns

### Criança com TEA
```json
{
  "aluno_id": "uuid-do-aluno",
  "cegueira": false,
  "baixa_visao": false,
  "surdez": false,
  "deficiencia_auditiva": false,
  "surdocegueira": false,
  "deficiencia_fisica": false,
  "deficiencia_multipla": false,
  "deficiencia_intelectual": false,
  "sindrome_down": false,
  "altas_habilidades": false,
  "tea": true,
  "alteracoes_processamento_auditivo": false,
  "tdah": false,
  "outros_diagnosticos": "TEA nível 1 - necessita apoio"
}
```

### Criança com Síndrome de Down
```json
{
  "aluno_id": "uuid-do-aluno",
  "cegueira": false,
  "baixa_visao": false,
  "surdez": false,
  "deficiencia_auditiva": false,
  "surdocegueira": false,
  "deficiencia_fisica": false,
  "deficiencia_multipla": false,
  "deficiencia_intelectual": true,
  "sindrome_down": true,
  "altas_habilidades": false,
  "tea": false,
  "alteracoes_processamento_auditivo": false,
  "tdah": false,
  "outros_diagnosticos": ""
}
```

### Criança sem Diagnóstico Específico
```json
{
  "aluno_id": "uuid-do-aluno",
  "cegueira": false,
  "baixa_visao": false,
  "surdez": false,
  "deficiencia_auditiva": false,
  "surdocegueira": false,
  "deficiencia_fisica": false,
  "deficiencia_multipla": false,
  "deficiencia_intelectual": false,
  "sindrome_down": false,
  "altas_habilidades": false,
  "tea": false,
  "alteracoes_processamento_auditivo": false,
  "tdah": false,
  "outros_diagnosticos": ""
}
```
