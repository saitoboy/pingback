# 🔧 Como Corrigir Migrações Corrompidas

Este guia explica como corrigir o erro de migrações corrompidas no banco de dados.

## 🚨 Problema

Se você receber o erro:
```
The migration directory is corrupt, the following files are missing: [nome_da_migração]
```

Isso significa que o banco de dados tem um registro na tabela `knex_migrations` que referencia uma migração que não existe mais no diretório de migrações.

## ✅ Solução Recomendada: Script Node.js

O método mais recomendado é usar o script Node.js, que identifica automaticamente todas as migrações corrompidas e as remove.

### Execução em Produção

```bash
NODE_ENV=production node scripts/fix_migration_corrupt.js
```

### Execução em Desenvolvimento

```bash
node scripts/fix_migration_corrupt.js
```

O script irá:
1. ✅ Listar todas as migrações do diretório
2. ✅ Listar todas as migrações registradas no banco
3. ✅ Identificar migrações corrompidas (registradas no banco mas não existem no diretório)
4. ✅ Remover os registros corrompidos da tabela `knex_migrations`

## 📝 Solução Alternativa: Script SQL

Se preferir usar SQL diretamente, você pode executar o arquivo SQL:

```bash
psql -U seu_usuario -d nome_do_banco -f scripts/fix_migration_corrupt.sql
```

**⚠️ IMPORTANTE:** Edite o arquivo SQL e substitua `20250125000001_fix_frequencia_structure` pelo nome da migração que está causando o problema.

## 🔍 Verificar Estado das Migrações

Para verificar quais migrações estão registradas no banco:

```sql
SELECT name, batch, migration_time 
FROM knex_migrations 
ORDER BY name;
```

## 📋 Após Corrigir

Após executar o script de correção, você pode executar as migrações normalmente:

```bash
npm run migrate
```

## ⚠️ Avisos Importantes

1. **Backup**: Sempre faça backup do banco de dados antes de executar scripts de correção
2. **Compatibilidade**: Certifique-se de que as migrações atuais no diretório são compatíveis com o estado atual do banco
3. **Produção**: Em produção, execute com cuidado e verifique o estado do banco antes e depois

## ❓ Resolução de Problemas

### Erro: "Cannot find module 'knex'"

**Solução:** Instale as dependências:
```bash
npm install
```

### Erro de conexão com banco de dados

**Solução:** Verifique se o arquivo `.env` está configurado corretamente com as credenciais do banco de dados:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `NODE_ENV=production` (para produção)

### Erro: "relation 'knex_migrations' does not exist"

**Solução:** Execute as migrações primeiro para criar a tabela:
```bash
npm run migrate
```

