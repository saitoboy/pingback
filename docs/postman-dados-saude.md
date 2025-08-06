# 🏥 Testes Postman - Dados de Saúde

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

## 🏥 Endpoints de Dados de Saúde

### 🧪 Teste Simples - Apenas 1 Campo
Teste com o mínimo absoluto:
```
POST http://localhost:3003/dados-saude
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "1f60eb87-efde-4a4f-860f-8e7575b3e4cd"
}
```

### 🧪 Teste Simples - 3 Campos Mínimos
```
POST http://localhost:3003/dados-saude
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "1f60eb87-efde-4a4f-860f-8e7575b3e4cd",
  "vacinas_em_dia": true,
  "dorme_bem": true
}
```

### 📝 JSON VÁLIDO - Copie e cole este exato:
```json
{
  "aluno_id": "1f60eb87-efde-4a4f-860f-8e7575b3e4cd",
  "necessidades_especiais": "Cadeirante",
  "vacinas_em_dia": true,
  "dorme_bem": true,
  "alimenta_se_bem": true,
  "uso_sanitario_sozinho": false,
  "restricao_alimentar": "Alergia a glúten",
  "problema_saude": "Asma",
  "alergia_medicamento": "Penicilina",
  "uso_continuo_medicamento": "Bombinha para asma",
  "alergias": "Pó, pólen",
  "medicacao_febre": "Paracetamol",
  "medicacao_dor_cabeca": "Paracetamol",
  "medicacao_dor_barriga": "Buscopan",
  "historico_convulsao": false,
  "perda_esfincter_emocional": false,
  "frequentou_outra_escola": true,
  "tipo_parto": "Normal",
  "gravidez_tranquila": true,
  "medicacao_gravidez": "Ácido fólico",
  "tem_irmaos": true,
  "fonoaudiologico": false,
  "psicopedagogico": false,
  "neurologico": false,
  "outro_tratamento": "Fisioterapia",
  "motivo_tratamento": "Desenvolvimento motor",
  "observacoes": "Criança muito ativa e sociável"
}
```

### 🧪 JSON MÍNIMO PARA TESTE:
```json
{
  "aluno_id": "1f60eb87-efde-4a4f-860f-8e7575b3e4cd",
  "vacinas_em_dia": true,
  "dorme_bem": true,
  "alimenta_se_bem": true,
  "uso_sanitario_sozinho": false,
  "historico_convulsao": false,
  "perda_esfincter_emocional": false,
  "frequentou_outra_escola": true,
  "gravidez_tranquila": true,
  "tem_irmaos": true,
  "fonoaudiologico": false,
  "psicopedagogico": false,
  "neurologico": false
}
```

### 3. 📋 Listar Todos os Dados de Saúde
```
GET http://localhost:3003/dados-saude
Authorization: Bearer SEU_TOKEN_AQUI
```

### 4. 🔍 Buscar Dados de Saúde por ID
```
GET http://localhost:3003/dados-saude/ID_DOS_DADOS_SAUDE
Authorization: Bearer SEU_TOKEN_AQUI
```

### 5. 👶 Buscar Dados de Saúde por Aluno
```
GET http://localhost:3003/dados-saude/aluno/ID_DO_ALUNO
Authorization: Bearer SEU_TOKEN_AQUI
```

### 6. ✏️ Atualizar Dados de Saúde
```
PUT http://localhost:3003/dados-saude/ID_DOS_DADOS_SAUDE
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "necessidades_especiais": "Cadeirante com prótese",
  "problema_saude": "Asma controlada",
  "medicacao_febre": "Dipirona",
  "observacoes": "Melhora significativa na adaptação escolar"
}
```

### 7. 🗑️ Deletar Dados de Saúde
```
DELETE http://localhost:3003/dados-saude/ID_DOS_DADOS_SAUDE
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🧪 Testes de Validação

### Teste 1: Campos Obrigatórios
```
POST http://localhost:3003/dados-saude
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "",
  "vacinas_em_dia": "",
  "dorme_bem": ""
}
```
**Resultado esperado:** Erro 400 com lista de campos obrigatórios

### Teste 2: Aluno Inexistente
```
POST http://localhost:3003/dados-saude
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "uuid-inexistente",
  "vacinas_em_dia": true,
  "dorme_bem": true
}
```
**Resultado esperado:** Erro 404 - Aluno não encontrado

### Teste 3: Tipo de Parto Inválido
```
POST http://localhost:3003/dados-saude
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "ID_VALIDO_DO_ALUNO",
  "vacinas_em_dia": true,
  "dorme_bem": true,
  "tipo_parto": "Waterbirth"
}
```
**Resultado esperado:** Erro 400 - Tipo de parto inválido

### Teste 4: Campo Muito Longo
```
POST http://localhost:3003/dados-saude
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "ID_VALIDO_DO_ALUNO",
  "vacinas_em_dia": true,
  "dorme_bem": true,
  "observacoes": "TEXTO_COM_MAIS_DE_500_CARACTERES..."
}
```
**Resultado esperado:** Erro 400 - Campo muito longo

### Teste 5: Dados Duplicados para o Mesmo Aluno
```
POST http://localhost:3003/dados-saude
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "aluno_id": "ID_QUE_JA_TEM_DADOS_SAUDE",
  "vacinas_em_dia": true,
  "dorme_bem": true
}
```
**Resultado esperado:** Erro 409 - Dados já cadastrados

---

## 📚 Preparação dos Dados

### Primeiro, você precisa ter:

1. **Um aluno cadastrado** - Use este endpoint para criar:
```
POST http://localhost:3003/aluno
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "nome_aluno": "Maria",
  "sobrenome_aluno": "Silva",
  "data_nascimento_aluno": "2015-03-15",
  "cpf_aluno": "12345678901",
  "rg_aluno": "123456789",
  "endereco_aluno": "Rua das Crianças, 456",
  "numero_matricula_aluno": "2025001",
  "religiao_id": "ID_DA_RELIGIAO",
  "certidao_id": "ID_DA_CERTIDAO"
}
```

2. **IDs necessários** - Listar para pegar IDs:
```
GET http://localhost:3003/aluno
GET http://localhost:3003/religiao  
GET http://localhost:3003/certidao
```

---

## ✅ Fluxo de Teste Recomendado

1. **Login** → Pegar token
2. **Listar alunos** → Pegar ID de um aluno
3. **Criar dados de saúde** → Para o aluno escolhido
4. **Listar dados de saúde** → Verificar se criou
5. **Buscar por ID** → Testar busca específica
6. **Buscar por aluno** → Testar busca por aluno
7. **Atualizar** → Modificar alguns campos
8. **Tentar criar duplicado** → Testar validação
9. **Deletar** → Remover dados

---

## 🚨 Códigos de Resposta Esperados

- **200** - Sucesso (GET, PUT, DELETE)
- **201** - Criado com sucesso (POST)
- **400** - Dados inválidos (validação)
- **401** - Não autenticado (sem token)
- **403** - Sem permissão (não é ADMIN/SECRETARIO)
- **404** - Não encontrado
- **409** - Conflito (dados duplicados)
- **500** - Erro interno

---

## 💡 Dicas

1. **Sempre use o token** obtido no login
2. **Copie os IDs** das respostas para usar nos próximos testes
3. **Teste as validações** para garantir que funcionam
4. **Verifique os JOINs** - dados de saúde vêm com nome do aluno
5. **Teste todos os cenários** de erro para validar robustez
