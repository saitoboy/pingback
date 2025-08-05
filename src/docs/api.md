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

**Response 400 (Dados inválidos):**
```json
{
  "error": "❌ Dados incompletos",
  "message": "Os seguintes campos são obrigatórios: nome_responsavel, cpf_responsavel, telefone_responsavel",
  "dados_faltando": ["nome_responsavel", "cpf_responsavel"]
}
```

---

### GET `/responsavel/aluno/:aluno_id`
**Descrição:** Listar responsáveis de um aluno específico
**Autenticação:** Bearer Token requerido
**Permissão:** Qualquer usuário autenticado

**Response 200 (Sucesso):**
```json
{
  "success": "✅ Lista de responsáveis do aluno obtida com sucesso",
  "aluno_id": "uuid-do-aluno",
  "total": 2,
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
