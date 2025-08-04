# API Documentation - Sistema Escolar Pinguinho

## 🔐 Autenticação

### Login de Usuário
**POST** `/auth/login`

```json
{
  "email": "admin@escola.com",
  "senha": "123456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Cadastro de Usuário
**POST** `/auth/registrar`

```json
{
  "nome_usuario": "João Silva",
  "email_usuario": "joao@escola.com",
  "senha_usuario": "123456",
  "tipo_usuario_id": "uuid-do-tipo-professor"
}
```

**Resposta de Sucesso (201):**
```json
{
  "mensagem": "Usuário cadastrado com sucesso.",
  "usuario": {
    "usuario_id": "uuid",
    "nome_usuario": "João Silva",
    "email_usuario": "joao@escola.com",
    "tipo_usuario_id": "uuid-do-tipo-professor",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  }
}
```

### Buscar Dados do Usuário Logado
**GET** `/auth/me`

**Headers:** `Authorization: Bearer {token}`

**Resposta de Sucesso (200):**
```json
{
  "usuario": {
    "usuario_id": "uuid",
    "nome_usuario": "João Silva",
    "email_usuario": "joao@escola.com",
    "tipo_usuario_id": "professor",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  }
}
```

---

## 👥 Tipos de Usuário

### Listar Tipos (Admin Only)
**GET** `/usuario-tipo`

**Headers:** `Authorization: Bearer {token}`

**Resposta de Sucesso (200):**
```json
[
  {
    "tipo_usuario_id": "uuid",
    "nome_tipo": "admin",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  }
]
```

### Criar Tipo (Admin Only)
**POST** `/usuario-tipo`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "nome_tipo": "professor"
}
```

---

## 👨‍🏫 Professores

### Criar Professor (Admin Only)
**POST** `/professor`

**Headers:** `Authorization: Bearer {token}`

```json
{
  "usuario_id": "uuid-do-usuario-professor"
}
```

**Resposta de Sucesso (201):**
```json
{
  "mensagem": "Professor criado com sucesso.",
  "professor": {
    "professor_id": "uuid",
    "usuario_id": "uuid-do-usuario",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  }
}
```

### Listar Professores (Admin Only)
**GET** `/professor`

**Headers:** `Authorization: Bearer {token}`

**Resposta de Sucesso (200):**
```json
{
  "professores": [
    {
      "professor_id": "uuid",
      "usuario_id": "uuid-do-usuario",
      "nome_usuario": "João Silva",
      "email_usuario": "joao@escola.com",
      "tipo_usuario_id": "professor",
      "created_at": "2025-01-01T10:00:00.000Z",
      "updated_at": "2025-01-01T10:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Buscar Professor por ID (Admin Only)
**GET** `/professor/{professor_id}`

**Headers:** `Authorization: Bearer {token}`

### Buscar Meu Perfil de Professor
**GET** `/professor/me`

**Headers:** `Authorization: Bearer {token}`

**Resposta de Sucesso (200):**
```json
{
  "professor": {
    "professor_id": "uuid",
    "usuario_id": "uuid-do-usuario",
    "nome_usuario": "João Silva",
    "email_usuario": "joao@escola.com",
    "tipo_usuario_id": "professor",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z"
  }
}
```

### Deletar Professor (Admin Only)
**DELETE** `/professor/{professor_id}`

**Headers:** `Authorization: Bearer {token}`

**Resposta de Sucesso (200):**
```json
{
  "mensagem": "Professor deletado com sucesso."
}
```

---

## 🚨 Códigos de Erro Comuns

- **400** - Dados inválidos ou campos obrigatórios ausentes
- **401** - Token não fornecido ou inválido
- **403** - Permissão insuficiente
- **404** - Recurso não encontrado
- **409** - Conflito (ex: email já cadastrado)
- **500** - Erro interno do servidor

---

## 🔑 Tipos de Usuário Disponíveis

- **admin** - Acesso total ao sistema
- **secretario** - Acesso a funcionalidades administrativas
- **professor** - Acesso a funcionalidades acadêmicas

---

## 📝 Observações Importantes

1. **Autenticação JWT**: Todos os endpoints protegidos precisam do header `Authorization: Bearer {token}`
2. **Tipos de Usuário**: Use os UUIDs retornados pelo endpoint `/usuario-tipo`, não os nomes
3. **Relação Professor-Usuário**: Um usuário do tipo "professor" precisa ter um registro na tabela `professor` para acessar funcionalidades específicas
4. **Permissões**: Apenas ADMINs podem criar/gerenciar professores e tipos de usuário
