# 📧 Configuração de Envio de Email

Este documento explica como configurar o envio de emails para o formulário de contato.

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis no arquivo `.env` do backend:

### Opção 1: Gmail (Recomendado para começar)

```env
# Email de destino (onde as mensagens serão recebidas)
EMAIL_DESTINO=escolapinguinhodegentec@gmail.com

# Email remetente (pode ser o mesmo do destino)
EMAIL_USER=escolapinguinhodegentec@gmail.com

# Senha de App do Gmail (NÃO use a senha normal da conta)
EMAIL_PASS=sua_senha_de_app_aqui
```

### Opção 2: SMTP Customizado

Se você tiver um servidor SMTP próprio:

```env
EMAIL_DESTINO=escolapinguinhodegentec@gmail.com
EMAIL_FROM="Sistema Pinguinho <seu-email@dominio.com>"

# Configurações SMTP
SMTP_HOST=smtp.seu-servidor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-usuario-smtp
SMTP_PASS=sua-senha-smtp
```

## Como Obter Senha de App do Gmail

1. Acesse sua conta Google: https://myaccount.google.com/
2. Vá em **Segurança**
3. Ative a **Verificação em duas etapas** (obrigatório)
4. Vá em **Senhas de app** (pode estar em "Como fazer login no Google")
5. Selecione **App**: Email
6. Selecione **Dispositivo**: Outro (Personalizado)
7. Digite: "Sistema Pinguinho"
8. Clique em **Gerar**
9. Copie a senha gerada e use no `EMAIL_PASS`

## Testando a Configuração

Após configurar as variáveis de ambiente:

1. Reinicie o servidor backend
2. Acesse a landing page
3. Preencha o formulário de contato
4. Envie a mensagem
5. Verifique se o email chegou em `EMAIL_DESTINO`

## Troubleshooting

### Erro: "EAUTH" ou "authentication failed"
- Verifique se a senha de app está correta
- Certifique-se de que a verificação em duas etapas está ativada
- Tente gerar uma nova senha de app

### Erro: "Connection timeout"
- Verifique se as configurações SMTP estão corretas
- Verifique se a porta não está bloqueada pelo firewall

### Email não chega
- Verifique a pasta de spam
- Verifique se o `EMAIL_DESTINO` está correto
- Verifique os logs do servidor para mais detalhes

