# 🔐 Guia Completo: Configurar Senha de App do Google para Gmail

Este guia explica passo a passo como configurar o envio de emails usando senhas de app do Google.

---

## 📋 Pré-requisitos

1. Conta Google (Gmail) ativa
2. Verificação em duas etapas ativada na conta Google
3. Acesso ao arquivo `.env` do backend

---

## 🎯 Passo a Passo

### **1. Ativar Verificação em Duas Etapas**

A senha de app só funciona se a verificação em duas etapas estiver ativada.

1. Acesse: https://myaccount.google.com/security
2. Procure por **"Verificação em duas etapas"** ou **"2-Step Verification"**
3. Clique em **"Ativar"** ou **"Começar"**
4. Siga as instruções para configurar (pode usar SMS, app autenticador, etc.)

> ⚠️ **IMPORTANTE**: Sem verificação em duas etapas ativada, você não conseguirá gerar senhas de app.

---

### **2. Gerar Senha de App**

1. Acesse: https://myaccount.google.com/apppasswords
   - Ou vá em: **Conta Google** → **Segurança** → **Senhas de app**

2. Se não encontrar "Senhas de app", pode estar em:
   - **Como fazer login no Google** → **Senhas de app**

3. Na página de Senhas de app:
   - **Selecione o app**: Escolha **"Email"**
   - **Selecione o dispositivo**: Escolha **"Outro (Personalizado)"**
   - **Digite um nome**: Ex: `Sistema Pinguinho` ou `Pingback API`
   - Clique em **"Gerar"**

4. **Copie a senha gerada** (16 caracteres, sem espaços)
   - Exemplo: `abcd efgh ijkl mnop` → use `abcdefghijklmnop`
   - ⚠️ **IMPORTANTE**: Você só verá esta senha UMA VEZ. Copie e guarde em local seguro!

---

### **3. Configurar no Arquivo .env**

Abra o arquivo `.env` do backend e adicione/atualize as seguintes variáveis:

```env
# ===========================================
# CONFIGURAÇÕES DE EMAIL (Gmail)
# ===========================================

# Email do Gmail que enviará os emails
EMAIL_USER=seu-email@gmail.com

# Senha de App do Google (16 caracteres, SEM espaços)
EMAIL_PASS=abcdefghijklmnop

# Email de destino (opcional, para contatos)
EMAIL_DESTINO=destino@gmail.com

# Nome do remetente (opcional)
EMAIL_FROM="Sistema Pinguinho <seu-email@gmail.com>"
```

**Exemplo completo:**

```env
EMAIL_USER=escolapinguinhodegentec@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_DESTINO=escolapinguinhodegentec@gmail.com
EMAIL_FROM="Sistema Pinguinho <escolapinguinhodegentec@gmail.com>"
```

> ⚠️ **ATENÇÃO**: 
> - Use a senha de app completa (16 caracteres)
> - Se a senha tiver espaços, remova-os ou deixe como está (o código trata isso)
> - NUNCA use sua senha normal do Gmail!

---

### **4. Verificar Configuração**

O código já está preparado para usar senhas de app do Google. O serviço de email (`email.service.ts`) funciona assim:

1. **Primeiro tenta SMTP customizado** (se tiver `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`)
2. **Se não tiver, usa Gmail** com `EMAIL_USER` e `EMAIL_PASS`

O código já está configurado corretamente! ✅

---

## 🧪 Testar a Configuração

### **Opção 1: Testar via API de Contato**

1. Inicie o servidor backend:
   ```bash
   npm run dev
   ```

2. Acesse a landing page e use o formulário de contato

3. Verifique se o email chegou em `EMAIL_DESTINO`

### **Opção 2: Testar via Redefinição de Senha**

1. Acesse a página de login
2. Clique em "Esqueceu a senha?"
3. Digite um email cadastrado
4. Verifique se o código chegou no email

---

## ❌ Problemas Comuns e Soluções

### **Erro: "EAUTH" ou "authentication failed"**

**Causas possíveis:**
- Senha de app incorreta
- Verificação em duas etapas não está ativada
- Senha de app expirada ou revogada

**Solução:**
1. Verifique se a verificação em duas etapas está ativada
2. Gere uma nova senha de app
3. Certifique-se de copiar a senha completa (16 caracteres)
4. Remova espaços da senha se houver

---

### **Erro: "Connection timeout"**

**Causa:** Problema de rede ou firewall bloqueando conexão SMTP

**Solução:**
1. Verifique sua conexão com internet
2. Tente usar uma rede diferente
3. Verifique se o firewall não está bloqueando a porta 587

---

### **Email não está sendo enviado**

**Verificações:**
1. ✅ Verifique se `EMAIL_USER` está correto
2. ✅ Verifique se `EMAIL_PASS` está correto (senha de app, não senha normal)
3. ✅ Verifique se o servidor está rodando
4. ✅ Verifique os logs do servidor para erros
5. ✅ Verifique a pasta de spam do email de destino

---

## 🔒 Segurança

### **Boas Práticas:**

1. ✅ Use senhas de app, nunca senhas normais
2. ✅ Mantenha o arquivo `.env` seguro (não commite no Git)
3. ✅ Use `.env.example` para documentar variáveis sem valores
4. ✅ Revogue senhas de app antigas que não usa mais
5. ✅ Use senhas de app específicas para cada aplicação

### **Revogar Senha de App:**

Se precisar revogar uma senha de app:

1. Acesse: https://myaccount.google.com/apppasswords
2. Encontre a senha de app que deseja revogar
3. Clique no ícone de lixeira ou "Revogar"
4. Confirme a ação

---

## 📝 Exemplo de Arquivo .env Completo

```env
# ===========================================
# CONFIGURAÇÕES DO SERVIDOR
# ===========================================
HOST=0.0.0.0
PORT=3003

# ===========================================
# CONFIGURAÇÕES DO BANCO DE DADOS POSTGRESQL
# ===========================================
DB_HOST=209.50.254.104
DB_PORT=5555
DB_NAME=pinguinho
DB_USER=postgres
DB_PASSWORD=sua_senha_db

# ===========================================
# CONFIGURAÇÕES DE AUTENTICAÇÃO
# ===========================================
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456789

# ===========================================
# CONFIGURAÇÕES DE AMBIENTE
# ===========================================
NODE_ENV=production

# ===========================================
# CONFIGURAÇÕES DE EMAIL (Gmail com Senha de App)
# ===========================================
EMAIL_USER=escolapinguinhodegentec@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_DESTINO=escolapinguinhodegentec@gmail.com
EMAIL_FROM="Sistema Pinguinho <escolapinguinhodegentec@gmail.com>"
```

---

## 🎓 Resumo Rápido

1. ✅ Ative verificação em duas etapas no Google
2. ✅ Gere senha de app em: https://myaccount.google.com/apppasswords
3. ✅ Configure `EMAIL_USER` e `EMAIL_PASS` no `.env`
4. ✅ Reinicie o servidor
5. ✅ Teste enviando um email

---

## 📚 Referências

- [Google Account Security](https://myaccount.google.com/security)
- [App Passwords](https://myaccount.google.com/apppasswords)
- [Nodemailer Gmail Guide](https://nodemailer.com/usage/using-gmail/)

---

**Última atualização**: 27 de Janeiro de 2026
