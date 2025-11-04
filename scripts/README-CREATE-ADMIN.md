# 📋 Como Criar Usuário Administrador

Este guia explica como criar um usuário administrador no sistema.

## 🚀 Método Recomendado: Script Node.js

O método mais recomendado é usar o script Node.js, que gera o hash bcrypt automaticamente.

### Execução Básica (com valores padrão)

```bash
npm run create:admin
```

Isso criará um usuário com:
- **Email**: `admin@escola.com`
- **Senha**: `admin123`
- **Nome**: `Administrador`

### Execução Personalizada

Você pode passar parâmetros personalizados:

```bash
node scripts/create-admin-user.js <email> <senha> <nome>
```

**Exemplo:**
```bash
node scripts/create-admin-user.js admin@minhaescola.com MinhaSenha123 Admin Nome
```

## 📝 Método Alternativo: Script SQL

Se preferir usar SQL diretamente, você pode executar o arquivo SQL:

```bash
psql -U seu_usuario -d nome_do_banco -f scripts/create-admin-user.sql
```

**⚠️ IMPORTANTE:** O script SQL usa um hash bcrypt pré-gerado para a senha `admin123`. Se quiser usar uma senha diferente, use o script Node.js.

## 📋 Credenciais Padrão

Após criar o usuário, você pode fazer login com:

- **Email**: `admin@escola.com`
- **Senha**: `admin123`

**⚠️ IMPORTANTE:** Altere a senha após o primeiro login por segurança!

## 🔍 Verificar Usuário Criado

Para verificar se o usuário foi criado corretamente, execute:

```sql
SELECT 
    usuario_id,
    nome_usuario,
    email_usuario,
    tipo_usuario_id,
    created_at
FROM usuario
WHERE email_usuario = 'admin@escola.com';
```

## ❓ Resolução de Problemas

### Erro: "Tipo de usuário 'admin' não encontrado"

**Solução:** Execute as migrações primeiro:

```bash
npm run migrate
```

### Erro: "Usuário com email já existe"

**Solução:** O usuário já foi criado anteriormente. Se quiser recriar, delete o usuário existente primeiro ou use um email diferente.

### Erro de conexão com banco de dados

**Solução:** Verifique se o arquivo `.env` está configurado corretamente com as credenciais do banco de dados:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
```

