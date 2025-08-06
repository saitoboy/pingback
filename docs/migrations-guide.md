# 🗄️ Guia de Migrações - Sistema Pinguinho

## 📋 Scripts Disponíveis

### Setup Inicial (Recomendado para novos desenvolvedores)
```bash
npm run db:setup
```
- ✅ Verifica status das migrações
- ✅ Executa apenas migrações pendentes
- ✅ Pula migrações já executadas automaticamente
- ✅ Mostra status final

### Comandos Básicos

#### Executar migrações pendentes
```bash
npm run migrate
```
- Executa apenas migrações que ainda não foram aplicadas
- Mostra detalhes verbose do que está sendo executado

#### Verificar status
```bash
npm run migrate:status
```
- Mostra quais migrações foram executadas
- Mostra quais estão pendentes

#### Verificar e confirmar
```bash
npm run migrate:check
```
- Mostra status + mensagem de confirmação

### Comandos Avançados

#### Resetar banco completo
```bash
npm run db:reset
```
- ⚠️ **CUIDADO**: Remove TODAS as migrações
- Executa tudo do zero

#### Desfazer última migração
```bash
npm run migrate:rollback
```

#### Resetar e recriar tudo
```bash
npm run migrate:fresh
```

#### Criar nova migração
```bash
npm run make:migration nome_da_migracao
```

## 🎯 Como Usar (Para Novos Desenvolvedores)

### 1. Primeira vez no projeto:
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Configurar banco (executa apenas o necessário)
npm run db:setup
```

### 2. Após git pull (quando há novas migrações):
```bash
npm run migrate
```

### 3. Para verificar se está tudo ok:
```bash
npm run migrate:status
```

## 📊 Interpretando o Status

```
$ npm run migrate:status

> Executed migrations:
  20250806_add_timestamps_to_dados_saude.js ✅

> Pending migrations:
  None ✅
```

- **Executed**: Migrações já aplicadas (✅ OK)
- **Pending**: Migrações pendentes (executar `npm run migrate`)

## 🔧 Estrutura de Migrações

```
migrations/
├── 20250806_add_timestamps_to_dados_saude.js
└── (futuras migrações...)
```

### Convenção de Nomes:
- **Formato**: `YYYYMMDD_descricao_da_migracao.js`
- **Exemplo**: `20250806_add_timestamps_to_dados_saude.js`

## ⚠️ Avisos Importantes

1. **Nunca edite migrações já executadas** - Crie uma nova migração
2. **Sempre teste migrações** antes de fazer commit
3. **Use `npm run migrate:status`** para verificar antes de executar
4. **Backup do banco** antes de usar `db:reset` ou `migrate:fresh`

## 🚀 Comandos para Produção

```bash
# Verificar antes de aplicar
npm run migrate:status

# Aplicar migrações (só as pendentes)
npm run migrate

# Verificar novamente
npm run migrate:status
```

## 🆘 Troubleshooting

### Erro: "Migration already ran"
- ✅ **Normal**: Knex pula automaticamente
- Executar: `npm run migrate:status` para confirmar

### Erro: "No migrations to run"
- ✅ **Normal**: Todas as migrações já foram executadas
- Banco está atualizado

### Erro de conexão com banco
- Verificar variáveis `.env`
- Verificar se PostgreSQL está rodando
- Verificar permissões de usuário

### Resetar tudo (último recurso)
```bash
npm run db:reset
```

---

## 📝 Exemplo de Uso Completo

```bash
# Desenvolvedor novo no projeto
git clone <projeto>
cd projeto
npm install
cp .env.example .env
# (configurar .env com dados do banco)
npm run db:setup

# Desenvolvedor experiente - após git pull
git pull origin main
npm run migrate

# Verificar se está tudo ok
npm run migrate:status
```
