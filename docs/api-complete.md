# 📚 API Documentation - Sistema Pinguinho

## 📋 Índice
- [Autenticação](#autenticação)
- [Tipos de Usuário](#tipos-de-usuário)
- [Professores](#professores)
- [Alunos](#alunos)
- [Responsáveis](#responsáveis)
- [Parentesco](#parentesco)
- [Religião](#religião)
- [Certidão](#certidão)
- [Códigos de Status](#códigos-de-status)
- [Dados de Saúde](#dados-de-saúde)

---

## 🔐 Autenticação

### POST `/auth/login`
**Descrição:** Realiza login no sistema
**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "admin@escola.com",
  "senha": "senha123"
}
```

**Response 200 (Sucesso):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 400 (Campos inválidos):**
```json
{
  "mensagem": "Campos obrigatórios ausentes ou incorretos: email, senha"
}
```

**Response 401 (Credenciais inválidas):**
```json
{
  "mensagem": "Email ou senha inválidos."
}
```

**Response 500 (Erro interno):**
```json
{
  "mensagem": "Erro interno do servidor.",
  "detalhes": "Descrição do erro"
}
```

---

### POST `/auth/registrar`
**Descrição:** Registra novo usuário no sistema
**Autenticação:** Não requerida

**Request Body:**
```json
{
  "nome_usuario": "João Silva",
  "email_usuario": "joao@escola.com",
  "senha_usuario": "senha123",
  "tipo_usuario_id": "uuid-do-tipo-usuario"
}
```

**Response 201 (Usuário criado):**
```json
{
  "mensagem": "Usuário cadastrado com sucesso.",
  "usuario": {
    "usuario_id": "uuid-do-usuario",
    "nome_usuario": "João Silva",
    "email_usuario": "joao@escola.com",
    "tipo_usuario_id": "uuid-do-tipo",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

**Response 400 (Campos inválidos):**
```json
{
  "mensagem": "Campos obrigatórios ausentes ou incorretos: nome_usuario, email_usuario"
}
```

**Response 409 (Email já existe):**
```json
{
  "mensagem": "Email já cadastrado."
}
```

---

### GET `/auth/me`
**Descrição:** Busca dados do usuário autenticado
**Autenticação:** Bearer Token requerido

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 (Sucesso):**
```json
{
  "usuario": {
    "usuario_id": "uuid-do-usuario",
    "nome_usuario": "João Silva",
    "email_usuario": "joao@escola.com",
    "tipo_usuario_id": "uuid-do-tipo",
    "tipo_usuario_nome": "ADMIN",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

**Response 401 (Não autenticado):**
```json
{
  "mensagem": "Usuário não autenticado."
}
```

**Response 404 (Usuário não encontrado):**
```json
{
  "mensagem": "Usuário não encontrado."
}
```

---

## 👥 Tipos de Usuário

### GET `/usuario-tipo`
**Descrição:** Lista todos os tipos de usuário
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "message": "Tipos de usuário obtidos com sucesso",
  "data": [
    {
      "tipo_usuario_id": "uuid-admin",
      "nome_tipo": "ADMIN",
      "descricao_tipo": "Administrador do sistema",
      "created_at": "2025-08-05T10:30:00Z",
      "updated_at": "2025-08-05T10:30:00Z"
    },
    {
      "tipo_usuario_id": "uuid-professor",
      "nome_tipo": "PROFESSOR",
      "descricao_tipo": "Professor da escola",
      "created_at": "2025-08-05T10:30:00Z",
      "updated_at": "2025-08-05T10:30:00Z"
    }
  ]
}
```

---

## 👨‍🏫 Professores

### POST `/professor`
**Descrição:** Criar novo professor
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Request Body:**
```json
{
  "usuario_id": "uuid-do-usuario",
  "especialidade_professor": "Matemática",
  "telefone_professor": "11987654321",
  "endereco_professor": "Rua das Flores, 123"
}
```

**Response 201 (Professor criado):**
```json
{
  "message": "✅ Professor criado com sucesso",
  "data": {
    "professor_id": "uuid-do-professor",
    "usuario_id": "uuid-do-usuario",
    "especialidade_professor": "Matemática",
    "telefone_professor": "11987654321",
    "endereco_professor": "Rua das Flores, 123",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

**Response 403 (Sem permissão):**
```json
{
  "mensagem": "Acesso negado. Permissão insuficiente."
}
```

---

### GET `/professor`
**Descrição:** Listar todos os professores
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Response 200 (Sucesso):**
```json
{
  "message": "✅ Lista de professores obtida com sucesso",
  "total": 2,
  "data": [
    {
      "professor_id": "uuid-do-professor",
      "usuario_id": "uuid-do-usuario",
      "especialidade_professor": "Matemática",
      "telefone_professor": "11987654321",
      "endereco_professor": "Rua das Flores, 123",
      "nome_usuario": "João Silva",
      "email_usuario": "joao@escola.com",
      "tipo_usuario_nome": "PROFESSOR",
      "created_at": "2025-08-05T10:30:00Z",
      "updated_at": "2025-08-05T10:30:00Z"
    }
  ]
}
```

---

### GET `/professor/me`
**Descrição:** Buscar perfil do próprio professor
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "message": "✅ Perfil do professor encontrado",
  "data": {
    "professor_id": "uuid-do-professor",
    "usuario_id": "uuid-do-usuario",
    "especialidade_professor": "Matemática",
    "telefone_professor": "11987654321",
    "endereco_professor": "Rua das Flores, 123",
    "nome_usuario": "João Silva",
    "email_usuario": "joao@escola.com",
    "created_at": "2025-08-05T10:30:00Z"
  }
}
```

**Response 404 (Professor não encontrado):**
```json
{
  "error": "❌ Professor não encontrado",
  "message": "Nenhum perfil de professor foi encontrado para este usuário"
}
```

---

## 👶 Alunos

### POST `/aluno`
**Descrição:** Criar novo aluno
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Request Body:**
```json
{
  "nome_aluno": "Maria Silva",
  "sobrenome_aluno": "Santos",
  "data_nascimento_aluno": "2015-03-15",
  "cpf_aluno": "12345678901",
  "rg_aluno": "123456789",
  "endereco_aluno": "Rua das Crianças, 456",
  "numero_matricula_aluno": "2025001",
  "religiao_id": "uuid-da-religiao",
  "certidao_id": "uuid-da-certidao"
}
```

**Response 201 (Aluno criado):**
```json
{
  "success": "✅ Aluno criado com sucesso",
  "data": {
    "aluno_id": "uuid-do-aluno",
    "nome_aluno": "Maria Silva",
    "sobrenome_aluno": "Santos",
    "data_nascimento_aluno": "2015-03-15",
    "cpf_aluno": "12345678901",
    "rg_aluno": "123456789",
    "endereco_aluno": "Rua das Crianças, 456",
    "numero_matricula_aluno": "2025001",
    "religiao_id": "uuid-da-religiao",
    "certidao_id": "uuid-da-certidao",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

**Response 400 (Dados inválidos):**
```json
{
  "error": "❌ Dados incompletos",
  "message": "Os seguintes campos são obrigatórios: nome_aluno, sobrenome_aluno, data_nascimento_aluno",
  "dados_faltando": ["nome_aluno", "sobrenome_aluno"]
}
```

---

### GET `/aluno`
**Descrição:** Listar todos os alunos
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "success": "✅ Lista de alunos obtida com sucesso",
  "total": 1,
  "data": [
    {
      "aluno_id": "uuid-do-aluno",
      "nome_aluno": "Maria Silva",
      "sobrenome_aluno": "Santos",
      "data_nascimento_aluno": "2015-03-15",
      "cpf_aluno": "12345678901",
      "numero_matricula_aluno": "2025001",
      "religiao_nome": "Católica",
      "certidao_matricula": "123456789",
      "created_at": "2025-08-05T10:30:00Z"
    }
  ]
}
```

---

### GET `/aluno/:id`
**Descrição:** Buscar aluno por ID
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "success": "✅ Aluno encontrado",
  "data": {
    "aluno_id": "uuid-do-aluno",
    "nome_aluno": "Maria Silva",
    "sobrenome_aluno": "Santos",
    "data_nascimento_aluno": "2015-03-15",
    "cpf_aluno": "12345678901",
    "rg_aluno": "123456789",
    "endereco_aluno": "Rua das Crianças, 456",
    "numero_matricula_aluno": "2025001",
    "religiao_nome": "Católica",
    "certidao_matricula": "123456789",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

**Response 404 (Aluno não encontrado):**
```json
{
  "error": "❌ Aluno não encontrado",
  "message": "Nenhum aluno foi encontrado com este ID"
}
```

---

## 👨‍👩‍👧‍👦 Responsáveis

### POST `/responsavel`
**Descrição:** Criar novo responsável para um aluno
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Request Body:**
```json
{
  "aluno_id": "uuid-do-aluno",
  "nome_responsavel": "Carlos",
  "sobrenome_responsavel": "Silva",
  "cpf_responsavel": "98765432100",
  "rg_responsavel": "987654321",
  "telefone_responsavel": "11987654321",
  "email_responsavel": "carlos@email.com",
  "parentesco_id": "uuid-do-parentesco",
  "grau_instrucao_responsavel": "Ensino Superior"
}
```

**Response 201 (Responsável criado):**
```json
{
  "success": "✅ Responsável criado com sucesso",
  "data": {
    "responsavel_id": "uuid-do-responsavel",
    "aluno_id": "uuid-do-aluno",
    "nome_responsavel": "Carlos",
    "sobrenome_responsavel": "Silva",
    "cpf_responsavel": "98765432100",
    "rg_responsavel": "987654321",
    "telefone_responsavel": "11987654321",
    "email_responsavel": "carlos@email.com",
    "parentesco_id": "uuid-do-parentesco",
    "grau_instrucao_responsavel": "Ensino Superior",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

**Response 400 (Campos obrigatórios):**
```json
{
  "error": "❌ Dados incompletos",
  "message": "Os seguintes campos são obrigatórios: nome_responsavel, cpf_responsavel, telefone_responsavel",
  "codigo_erro": "CAMPOS_OBRIGATORIOS",
  "dados_faltando": ["nome_responsavel", "cpf_responsavel"]
}
```

**Response 400 (CPF inválido):**
```json
{
  "error": "❌ CPF inválido",
  "message": "CPF deve ter exatamente 11 dígitos. Recebido: 123456789",
  "codigo_erro": "CPF_INVALIDO",
  "cpf_recebido": "123456789",
  "dica": "Envie apenas números (ex: 12345678901)"
}
```

**Response 400 (Telefone inválido):**
```json
{
  "error": "❌ Telefone inválido",
  "message": "Telefone deve ter 10 ou 11 dígitos. Recebido: 123456",
  "codigo_erro": "TELEFONE_INVALIDO",
  "telefone_recebido": "123456",
  "dica": "Envie apenas números (ex: 11987654321)"
}
```

**Response 400 (Email inválido):**
```json
{
  "error": "❌ Email inválido",
  "message": "O email carlos@invalid não possui formato válido",
  "codigo_erro": "EMAIL_INVALIDO",
  "email_recebido": "carlos@invalid",
  "dica": "Use formato válido como: nome@dominio.com"
}
```

**Response 404 (Aluno não encontrado):**
```json
{
  "error": "❌ Aluno não encontrado",
  "message": "Não foi encontrado nenhum aluno com o ID: uuid-inexistente",
  "codigo_erro": "ALUNO_NAO_ENCONTRADO",
  "aluno_id_fornecido": "uuid-inexistente",
  "dica": "Verifique se o aluno_id está correto ou se o aluno existe no sistema"
}
```

**Response 404 (Parentesco não encontrado):**
```json
{
  "error": "❌ Parentesco não encontrado",
  "message": "Não foi encontrado nenhum parentesco com o ID: uuid-inexistente",
  "codigo_erro": "PARENTESCO_NAO_ENCONTRADO",
  "parentesco_id_fornecido": "uuid-inexistente",
  "dica": "Verifique se o parentesco_id está correto ou liste os parentescos disponíveis"
}
```

**Response 409 (CPF duplicado):**
```json
{
  "error": "❌ CPF já cadastrado",
  "message": "O CPF 98765432100 já está cadastrado para outro responsável",
  "codigo_erro": "CPF_DUPLICADO",
  "cpf_problematico": "98765432100"
}
```

---

### GET `/responsavel`
**Descrição:** Listar todos os responsáveis
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "success": "✅ Lista de responsáveis obtida com sucesso",
  "total": 1,
  "data": [
    {
      "responsavel_id": "uuid-do-responsavel",
      "nome_responsavel": "Carlos",
      "sobrenome_responsavel": "Silva",
      "cpf_responsavel": "98765432100",
      "telefone_responsavel": "11987654321",
      "email_responsavel": "carlos@email.com",
      "parentesco_nome": "Pai",
      "grau_instrucao_responsavel": "Ensino Superior",
      "aluno_nome": "Maria Silva Santos"
    }
  ]
}
```

---

### GET `/responsavel/:id`
**Descrição:** Buscar responsável por ID
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "success": "✅ Responsável encontrado",
  "data": {
    "responsavel_id": "uuid-do-responsavel",
    "nome_responsavel": "Carlos",
    "sobrenome_responsavel": "Silva",
    "cpf_responsavel": "98765432100",
    "rg_responsavel": "987654321",
    "telefone_responsavel": "11987654321",
    "email_responsavel": "carlos@email.com",
    "parentesco_nome": "Pai",
    "grau_instrucao_responsavel": "Ensino Superior",
    "aluno_nome": "Maria Silva Santos",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

**Response 404 (Responsável não encontrado):**
```json
{
  "error": "❌ Responsável não encontrado",
  "message": "Nenhum responsável foi encontrado com este ID",
  "codigo_erro": "RESPONSAVEL_NAO_ENCONTRADO",
  "responsavel_id_fornecido": "uuid-inexistente"
}
```

---

### GET `/responsavel/cpf/:cpf`
**Descrição:** Buscar responsável por CPF
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "success": "✅ Responsável encontrado",
  "data": {
    "responsavel_id": "uuid-do-responsavel",
    "nome_responsavel": "Carlos",
    "sobrenome_responsavel": "Silva",
    "cpf_responsavel": "98765432100",
    "telefone_responsavel": "11987654321",
    "email_responsavel": "carlos@email.com",
    "parentesco_nome": "Pai",
    "aluno_nome": "Maria Silva Santos"
  }
}
```

**Response 400 (CPF formato inválido):**
```json
{
  "error": "❌ CPF inválido",
  "message": "CPF deve ter exatamente 11 dígitos. Recebido: 123456789 (9 dígitos)",
  "codigo_erro": "CPF_FORMATO_INVALIDO",
  "cpf_recebido": "123456789",
  "dica": "Envie apenas números (ex: 12345678901)"
}
```

**Response 404 (Responsável não encontrado):**
```json
{
  "error": "❌ Responsável não encontrado",
  "message": "Nenhum responsável foi encontrado com este CPF",
  "codigo_erro": "RESPONSAVEL_NAO_ENCONTRADO_CPF",
  "cpf_pesquisado": "98765432100"
}
```

---

### PUT `/responsavel/:id`
**Descrição:** Atualizar dados do responsável
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Request Body (campos opcionais):**
```json
{
  "nome_responsavel": "Carlos José",
  "telefone_responsavel": "11999888777",
  "email_responsavel": "carlos.jose@email.com"
}
```

**Response 200 (Atualizado com sucesso):**
```json
{
  "success": "✅ Responsável atualizado com sucesso",
  "data": {
    "responsavel_id": "uuid-do-responsavel",
    "nome_responsavel": "Carlos José",
    "sobrenome_responsavel": "Silva",
    "cpf_responsavel": "98765432100",
    "telefone_responsavel": "11999888777",
    "email_responsavel": "carlos.jose@email.com",
    "updated_at": "2025-08-05T11:30:00Z"
  }
}
```

**Response 400 (Nenhum campo fornecido):**
```json
{
  "error": "❌ Dados incompletos",
  "message": "Pelo menos um campo deve ser fornecido para atualização",
  "codigo_erro": "NENHUM_CAMPO_PARA_ATUALIZAR"
}
```

**Response 404 (Responsável não encontrado):**
```json
{
  "error": "❌ Responsável não encontrado",
  "message": "Não foi possível encontrar o responsável para atualizar",
  "codigo_erro": "RESPONSAVEL_NAO_ENCONTRADO",
  "responsavel_id_fornecido": "uuid-inexistente"
}
```

**Response 409 (CPF já em uso):**
```json
{
  "error": "❌ CPF já está em uso",
  "message": "O CPF 11111111111 já está cadastrado para outro responsável",
  "codigo_erro": "CPF_DUPLICADO",
  "cpf_problematico": "11111111111"
}
```

---

### DELETE `/responsavel/:id`
**Descrição:** Remover responsável do sistema
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Response 200 (Deletado com sucesso):**
```json
{
  "success": "✅ Responsável deletado com sucesso",
  "message": "O responsável foi removido do sistema",
  "responsavel_id_deletado": "uuid-do-responsavel"
}
```

**Response 404 (Responsável não encontrado):**
```json
{
  "error": "❌ Responsável não encontrado",
  "message": "Nenhum responsável foi encontrado com este ID para deletar",
  "codigo_erro": "RESPONSAVEL_NAO_ENCONTRADO",
  "responsavel_id_fornecido": "uuid-inexistente"
}
```

---

## 👪 Parentesco

### POST `/parentesco`
**Descrição:** Criar novo tipo de parentesco
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Request Body:**
```json
{
  "nome_parentesco": "Pai"
}
```

**Response 201 (Parentesco criado):**
```json
{
  "mensagem": "Parentesco criado com sucesso.",
  "parentesco": {
    "parentesco_id": "uuid-do-parentesco",
    "nome_parentesco": "Pai",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

**Response 400 (Campo obrigatório):**
```json
{
  "mensagem": "Campo nome_parentesco é obrigatório."
}
```

**Response 409 (Nome duplicado):**
```json
{
  "mensagem": "Já existe um parentesco com este nome."
}
```

---

### GET `/parentesco`
**Descrição:** Listar todos os tipos de parentesco
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "parentescos": [
    {
      "parentesco_id": "uuid-do-parentesco",
      "nome_parentesco": "Pai",
      "created_at": "2025-08-05T10:30:00Z",
      "updated_at": "2025-08-05T10:30:00Z"
    },
    {
      "parentesco_id": "uuid-do-parentesco-2",
      "nome_parentesco": "Mãe",
      "created_at": "2025-08-05T10:30:00Z",
      "updated_at": "2025-08-05T10:30:00Z"
    }
  ],
  "total": 2
}
```

---

### DELETE `/parentesco/:id`
**Descrição:** Remover tipo de parentesco
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Response 200 (Sucesso):**
```json
{
  "mensagem": "Parentesco deletado com sucesso."
}
```

**Response 400 (Constraint de FK):**
```json
{
  "mensagem": "Não é possível deletar este parentesco pois existem responsáveis vinculados a ele."
}
```

**Response 404 (Não encontrado):**
```json
{
  "mensagem": "Parentesco não encontrado."
}
```

---

## ⛪ Religião

### POST `/religiao`
**Descrição:** Criar nova religião
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Request Body:**
```json
{
  "nome_religiao": "Católica"
}
```

**Response 201 (Religião criada):**
```json
{
  "mensagem": "Religião criada com sucesso.",
  "religiao": {
    "religiao_id": "uuid-da-religiao",
    "nome_religiao": "Católica",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

---

### GET `/religiao`
**Descrição:** Listar todas as religiões
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "religioes": [
    {
      "religiao_id": "uuid-da-religiao",
      "nome_religiao": "Católica",
      "created_at": "2025-08-05T10:30:00Z",
      "updated_at": "2025-08-05T10:30:00Z"
    }
  ],
  "total": 1
}
```

---

## 📄 Certidão

### POST `/certidao`
**Descrição:** Criar nova certidão de nascimento
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Request Body:**
```json
{
  "numero_matricula_certidao": "123456789",
  "cartorio_certidao": "1º Cartório de Registro Civil",
  "livro_certidao": "001",
  "folha_certidao": "123",
  "data_emissao_certidao": "2015-03-20"
}
```

**Response 201 (Certidão criada):**
```json
{
  "mensagem": "Certidão criada com sucesso.",
  "certidao": {
    "certidao_id": "uuid-da-certidao",
    "numero_matricula_certidao": "123456789",
    "cartorio_certidao": "1º Cartório de Registro Civil",
    "livro_certidao": "001",
    "folha_certidao": "123",
    "data_emissao_certidao": "2015-03-20",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

---

### GET `/certidao/matricula/:matricula`
**Descrição:** Buscar certidão por número de matrícula
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "certidao": {
    "certidao_id": "uuid-da-certidao",
    "numero_matricula_certidao": "123456789",
    "cartorio_certidao": "1º Cartório de Registro Civil",
    "livro_certidao": "001",
    "folha_certidao": "123",
    "data_emissao_certidao": "2015-03-20",
    "created_at": "2025-08-05T10:30:00Z",
    "updated_at": "2025-08-05T10:30:00Z"
  }
}
```

**Response 404 (Não encontrada):**
```json
{
  "mensagem": "Certidão não encontrada."
}
```

---

## 📊 Códigos de Status HTTP

| Código | Descrição | Uso |
|--------|-----------|-----|
| **200** | OK | Operação bem-sucedida |
| **201** | Created | Recurso criado com sucesso |
| **400** | Bad Request | Dados inválidos ou ausentes |
| **401** | Unauthorized | Token inválido ou ausente |
| **403** | Forbidden | Sem permissão para acessar |
| **404** | Not Found | Recurso não encontrado |
| **409** | Conflict | Conflito (ex: email já existe) |
| **500** | Internal Server Error | Erro interno do servidor |

---

## 🔑 Autenticação

Todas as rotas protegidas requerem o header:
```
Authorization: Bearer <token-jwt>
```

## 🛡️ Permissões

- **ADMIN**: Acesso total ao sistema
- **PROFESSOR**: Acesso de leitura aos dados dos alunos
- **Qualquer usuário autenticado**: Acesso de leitura às entidades básicas

---

## 📝 Notas Importantes

1. **UUIDs**: Todos os IDs são UUIDs v4
2. **Datas**: Formato ISO 8601 (YYYY-MM-DD)
3. **CPF**: Apenas números, 11 dígitos
4. **Telefone**: Apenas números, 10 ou 11 dígitos
5. **Email**: Formato válido obrigatório
6. **Constraint Errors**: Violações de chave estrangeira retornam códigos específicos
7. **Códigos de Erro**: Sempre presente no campo `codigo_erro` para facilitar tratamento programático
8. **Mensagens Específicas**: Cada erro retorna uma mensagem detalhada explicando exatamente o problema
9. **Campos Extras**: Erros incluem campos adicionais com informações relevantes (ex: `cpf_problematico`, `dica`)
10. **Status HTTP**: Códigos padronizados (400 para validação, 404 para não encontrado, 409 para conflito, 500 para erro interno)

---

## 🚨 Códigos de Erro Detalhados

### Responsáveis

| Código de Erro | Status HTTP | Descrição | Campos Extras |
|---|---|---|---|
| `CAMPOS_OBRIGATORIOS` | 400 | Campos obrigatórios ausentes | `dados_faltando[]` |
| `CAMPO_OBRIGATORIO` | 400 | Campo específico obrigatório | `campo_faltando` |
| `CPF_INVALIDO` | 400 | CPF com formato inválido (≠ 11 dígitos) | `cpf_recebido`, `dica` |
| `CPF_FORMATO_INVALIDO` | 400 | CPF com formato inválido na busca | `cpf_recebido`, `dica` |
| `CPF_DUPLICADO` | 409 | CPF já cadastrado para outro responsável | `cpf_problematico` |
| `TELEFONE_INVALIDO` | 400 | Telefone com formato inválido (< 10 ou > 11 dígitos) | `telefone_recebido`, `dica` |
| `EMAIL_INVALIDO` | 400 | Email com formato inválido | `email_recebido`, `dica` |
| `ALUNO_NAO_ENCONTRADO` | 404 | Aluno não existe no sistema | `aluno_id_fornecido`, `dica` |
| `PARENTESCO_NAO_ENCONTRADO` | 404 | Parentesco não existe no sistema | `parentesco_id_fornecido`, `dica` |
| `RESPONSAVEL_NAO_ENCONTRADO` | 404 | Responsável não encontrado por ID | `responsavel_id_fornecido` |
| `RESPONSAVEL_NAO_ENCONTRADO_CPF` | 404 | Responsável não encontrado por CPF | `cpf_pesquisado` |
| `NENHUM_CAMPO_PARA_ATUALIZAR` | 400 | Nenhum campo fornecido na atualização | - |
| `ID_OBRIGATORIO` | 400 | ID do responsável é obrigatório | - |
| `ID_ALUNO_OBRIGATORIO` | 400 | ID do aluno é obrigatório | - |
| `CPF_OBRIGATORIO` | 400 | CPF é obrigatório na busca | - |
| `ERRO_INTERNO` | 500 | Erro interno do servidor | - |

### Parentesco

| Código de Erro | Status HTTP | Descrição | Campos Extras |
|---|---|---|---|
| `NOME_OBRIGATORIO` | 400 | Nome do parentesco é obrigatório | - |
| `PARENTESCO_DUPLICADO` | 409 | Já existe parentesco com este nome | `nome_existente` |
| `PARENTESCO_NAO_ENCONTRADO` | 404 | Parentesco não encontrado | `parentesco_id_fornecido` |
| `PARENTESCO_EM_USO` | 400 | Parentesco vinculado a responsáveis | `total_responsaveis` |

### Alunos

| Código de Erro | Status HTTP | Descrição | Campos Extras |
|---|---|---|---|
| `CAMPOS_OBRIGATORIOS` | 400 | Campos obrigatórios ausentes | `dados_faltando[]` |
| `ALUNO_NAO_ENCONTRADO` | 404 | Aluno não encontrado | `aluno_id_fornecido` |
| `CPF_DUPLICADO` | 409 | CPF já cadastrado | `cpf_problematico` |
| `MATRICULA_DUPLICADA` | 409 | Número de matrícula já existe | `matricula_problematica` |

### Autenticação

| Código de Erro | Status HTTP | Descrição | Campos Extras |
|---|---|---|---|
| `CREDENCIAIS_INVALIDAS` | 401 | Email ou senha incorretos | - |
| `TOKEN_AUSENTE` | 401 | Token de autorização não fornecido | - |
| `TOKEN_INVALIDO` | 401 | Token JWT inválido ou expirado | - |
| `PERMISSAO_NEGADA` | 403 | Usuário sem permissão para esta ação | `permissao_requerida` |
| `EMAIL_DUPLICADO` | 409 | Email já cadastrado | `email_problematico` |

---

## 📋 Exemplos de Teste no Postman

### 1. Teste de CPF Duplicado
**POST** `/responsavel`
```json
{
  "aluno_id": "uuid-valido",
  "nome_responsavel": "João",
  "sobrenome_responsavel": "Silva",
  "cpf_responsavel": "12345678901",  // ← CPF já existente
  "rg_responsavel": "123456789",
  "telefone_responsavel": "11987654321",
  "email_responsavel": "joao@email.com",
  "parentesco_id": "uuid-valido"
}
```
**Resposta esperada:**
```json
{
  "error": "❌ CPF já cadastrado",
  "message": "O CPF 12345678901 já está cadastrado para outro responsável",
  "codigo_erro": "CPF_DUPLICADO",
  "cpf_problematico": "12345678901"
}
```

### 2. Teste de CPF Inválido
**POST** `/responsavel`
```json
{
  "cpf_responsavel": "123456789"  // ← Apenas 9 dígitos
}
```
**Resposta esperada:**
```json
{
  "error": "❌ CPF inválido",
  "message": "CPF deve ter exatamente 11 dígitos. Recebido: 123456789 (9 dígitos)",
  "codigo_erro": "CPF_INVALIDO",
  "cpf_recebido": "123456789",
  "dica": "Envie apenas números (ex: 12345678901)"
}
```

### 3. Teste de Aluno Inexistente
**POST** `/responsavel`
```json
{
  "aluno_id": "uuid-inexistente",  // ← UUID que não existe
  "nome_responsavel": "Maria",
  "cpf_responsavel": "98765432100"
}
```
**Resposta esperada:**
```json
{
  "error": "❌ Aluno não encontrado",
  "message": "Não foi encontrado nenhum aluno com o ID: uuid-inexistente",
  "codigo_erro": "ALUNO_NAO_ENCONTRADO",
  "aluno_id_fornecido": "uuid-inexistente",
  "dica": "Verifique se o aluno_id está correto ou se o aluno existe no sistema"
}
```

### 4. Teste de Email Inválido
**POST** `/responsavel`
```json
{
  "email_responsavel": "email-invalido"  // ← Sem @dominio.com
}
```
**Resposta esperada:**
```json
{
  "error": "❌ Email inválido",
  "message": "O email email-invalido não possui formato válido",
  "codigo_erro": "EMAIL_INVALIDO",
  "email_recebido": "email-invalido",
  "dica": "Use formato válido como: nome@dominio.com"
}
```

---

## 🏥 Dados de Saúde

### POST `/dados-saude`
**Descrição:** Criar novos dados de saúde para um aluno
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Request Body:**
```json
{
  "aluno_id": "uuid-do-aluno",
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
  "medicacao_gravidez": "",
  "tem_irmaos": true,
  "fonoaudiologico": false,
  "psicopedagogico": false,
  "neurologico": false,
  "outro_tratamento": "",
  "motivo_tratamento": "",
  "observacoes": "Criança muito ativa e sociável"
}
```

**Response 201 (Dados de saúde criados):**
```json
{
  "success": "✅ Dados de saúde criados com sucesso",
  "data": {
    "dados_saude_id": "uuid-dos-dados-saude",
    "aluno_id": "uuid-do-aluno",
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
    "medicacao_gravidez": "",
    "tem_irmaos": true,
    "fonoaudiologico": false,
    "psicopedagogico": false,
    "neurologico": false,
    "outro_tratamento": "",
    "motivo_tratamento": "",
    "observacoes": "Criança muito ativa e sociável",
    "created_at": "2025-08-06T10:30:00Z",
    "updated_at": "2025-08-06T10:30:00Z"
  }
}
```

**Response 400 (Campos obrigatórios):**
```json
{
  "error": "❌ Dados incompletos",
  "message": "Os seguintes campos são obrigatórios: aluno_id, vacinas_em_dia, dorme_bem",
  "codigo_erro": "CAMPOS_OBRIGATORIOS",
  "dados_faltando": ["aluno_id", "vacinas_em_dia", "dorme_bem"]
}
```

**Response 400 (Campo muito longo):**
```json
{
  "error": "❌ Campo muito longo",
  "message": "Campo 'observacoes' deve ter no máximo 500 caracteres",
  "codigo_erro": "CAMPO_MUITO_LONGO",
  "campo_problematico": "observacoes",
  "tamanho_atual": 650,
  "tamanho_maximo": 500,
  "dica": "Reduza o texto ou use observações para informações extras"
}
```

**Response 400 (Tipo de parto inválido):**
```json
{
  "error": "❌ Tipo de parto inválido",
  "message": "Tipo de parto deve ser um dos valores: Normal, Cesárea, Fórceps, Induzido, Outro",
  "codigo_erro": "TIPO_PARTO_INVALIDO",
  "tipo_parto_recebido": "Waterbirth",
  "tipos_validos": ["Normal", "Cesárea", "Fórceps", "Induzido", "Outro"],
  "dica": "Use um dos tipos listados ou deixe em branco"
}
```

**Response 404 (Aluno não encontrado):**
```json
{
  "error": "❌ Aluno não encontrado",
  "message": "Não foi encontrado nenhum aluno com o ID: uuid-inexistente",
  "codigo_erro": "ALUNO_NAO_ENCONTRADO",
  "aluno_id_fornecido": "uuid-inexistente",
  "dica": "Verifique se o aluno_id está correto ou se o aluno existe no sistema"
}
```

**Response 409 (Dados já cadastrados):**
```json
{
  "error": "❌ Dados de saúde já cadastrados",
  "message": "Já existem dados de saúde cadastrados para este aluno",
  "codigo_erro": "DADOS_SAUDE_DUPLICADOS",
  "aluno_id": "uuid-do-aluno",
  "dados_saude_existente_id": "uuid-existente",
  "dica": "Use PUT para atualizar os dados existentes ou DELETE para remover e criar novos"
}
```

---

### GET `/dados-saude`
**Descrição:** Listar todos os dados de saúde
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "success": "✅ Lista de dados de saúde obtida com sucesso",
  "total": 1,
  "data": [
    {
      "dados_saude_id": "uuid-dos-dados-saude",
      "aluno_id": "uuid-do-aluno",
      "nome_aluno": "Maria Silva",
      "sobrenome_aluno": "Santos",
      "numero_matricula_aluno": "2025001",
      "necessidades_especiais": "Cadeirante",
      "vacinas_em_dia": true,
      "problema_saude": "Asma",
      "restricao_alimentar": "Alergia a glúten",
      "observacoes": "Criança muito ativa e sociável",
      "created_at": "2025-08-06T10:30:00Z"
    }
  ]
}
```

---

### GET `/dados-saude/:id`
**Descrição:** Buscar dados de saúde por ID
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "success": "✅ Dados de saúde encontrados",
  "data": {
    "dados_saude_id": "uuid-dos-dados-saude",
    "aluno_id": "uuid-do-aluno",
    "nome_aluno": "Maria Silva",
    "sobrenome_aluno": "Santos",
    "numero_matricula_aluno": "2025001",
    "data_nascimento_aluno": "2015-03-15",
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
    "medicacao_gravidez": "",
    "tem_irmaos": true,
    "fonoaudiologico": false,
    "psicopedagogico": false,
    "neurologico": false,
    "outro_tratamento": "",
    "motivo_tratamento": "",
    "observacoes": "Criança muito ativa e sociável",
    "created_at": "2025-08-06T10:30:00Z",
    "updated_at": "2025-08-06T10:30:00Z"
  }
}
```

**Response 404 (Dados não encontrados):**
```json
{
  "error": "❌ Dados de saúde não encontrados",
  "message": "Nenhum registro de dados de saúde foi encontrado com este ID",
  "codigo_erro": "DADOS_SAUDE_NAO_ENCONTRADOS",
  "dados_saude_id_fornecido": "uuid-inexistente"
}
```

---

### GET `/dados-saude/aluno/:aluno_id`
**Descrição:** Buscar dados de saúde de um aluno específico
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "success": "✅ Dados de saúde do aluno encontrados",
  "data": {
    "dados_saude_id": "uuid-dos-dados-saude",
    "aluno_id": "uuid-do-aluno",
    "nome_aluno": "Maria Silva",
    "sobrenome_aluno": "Santos",
    "numero_matricula_aluno": "2025001",
    "data_nascimento_aluno": "2015-03-15",
    "necessidades_especiais": "Cadeirante",
    "vacinas_em_dia": true,
    "problema_saude": "Asma",
    "restricao_alimentar": "Alergia a glúten",
    "observacoes": "Criança muito ativa e sociável"
  }
}
```

**Response 404 (Aluno não encontrado):**
```json
{
  "error": "❌ Aluno não encontrado",
  "message": "Não foi encontrado nenhum aluno com o ID: uuid-inexistente",
  "codigo_erro": "ALUNO_NAO_ENCONTRADO",
  "aluno_id_fornecido": "uuid-inexistente"
}
```

**Response 404 (Dados não encontrados para o aluno):**
```json
{
  "error": "❌ Dados de saúde não encontrados",
  "message": "Nenhum registro de dados de saúde foi encontrado para este aluno",
  "codigo_erro": "DADOS_SAUDE_NAO_ENCONTRADOS_ALUNO",
  "aluno_id_fornecido": "uuid-do-aluno"
}
```

---

### PUT `/dados-saude/:id`
**Descrição:** Atualizar dados de saúde
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Request Body (campos opcionais):**
```json
{
  "necessidades_especiais": "Cadeirante com prótese",
  "problema_saude": "Asma controlada",
  "medicacao_febre": "Dipirona",
  "observacoes": "Melhora significativa na adaptação escolar"
}
```

**Response 200 (Atualizado com sucesso):**
```json
{
  "success": "✅ Dados de saúde atualizados com sucesso",
  "data": {
    "dados_saude_id": "uuid-dos-dados-saude",
    "aluno_id": "uuid-do-aluno",
    "necessidades_especiais": "Cadeirante com prótese",
    "problema_saude": "Asma controlada",
    "medicacao_febre": "Dipirona",
    "observacoes": "Melhora significativa na adaptação escolar",
    "updated_at": "2025-08-06T11:30:00Z"
  }
}
```

**Response 400 (Nenhum campo fornecido):**
```json
{
  "error": "❌ Dados incompletos",
  "message": "Pelo menos um campo deve ser fornecido para atualização",
  "codigo_erro": "NENHUM_CAMPO_PARA_ATUALIZAR"
}
```

**Response 404 (Dados não encontrados):**
```json
{
  "error": "❌ Dados de saúde não encontrados",
  "message": "Não foi possível encontrar os dados de saúde para atualizar",
  "codigo_erro": "DADOS_SAUDE_NAO_ENCONTRADOS",
  "dados_saude_id_fornecido": "uuid-inexistente"
}
```

---

### DELETE `/dados-saude/:id`
**Descrição:** Remover dados de saúde do sistema
**Autenticação:** Bearer Token requerido
**Permissão:** Apenas ADMIN

**Response 200 (Deletado com sucesso):**
```json
{
  "success": "✅ Dados de saúde deletados com sucesso",
  "message": "Os dados de saúde foram removidos do sistema",
  "dados_saude_id_deletado": "uuid-dos-dados-saude"
}
```

**Response 404 (Dados não encontrados):**
```json
{
  "error": "❌ Dados de saúde não encontrados",
  "message": "Nenhum registro de dados de saúde foi encontrado com este ID para deletar",
  "codigo_erro": "DADOS_SAUDE_NAO_ENCONTRADOS",
  "dados_saude_id_fornecido": "uuid-inexistente"
}
```
