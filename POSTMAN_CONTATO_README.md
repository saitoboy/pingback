# 📧 Collection Postman - Contato

Este documento explica como usar a collection do Postman para testar o envio de emails.

## 📁 Arquivos Disponíveis

1. **POSTMAN_CONTATO_COLLECTION.json** - Collection específica apenas para contato (3 requisições)
2. **POSTMAN_COLLECTION.json** - Collection completa da API (inclui contato + todas as outras rotas)

## 🚀 Como Importar no Postman

### Opção 1: Collection Específica de Contato

1. Abra o Postman
2. Clique em **Import** (canto superior esquerdo)
3. Selecione o arquivo `POSTMAN_CONTATO_COLLECTION.json`
4. Clique em **Import**

### Opção 2: Collection Completa

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `POSTMAN_COLLECTION.json`
4. Clique em **Import**

## 📋 Requisições Disponíveis

### 1. 📧 Enviar Mensagem de Contato
- **Método:** POST
- **URL:** `{{baseUrl}}/contato`
- **Autenticação:** Não requerida (rota pública)
- **Body:**
```json
{
  "nome": "João Silva",
  "telefone": "(32) 98857-4727",
  "email": "joao.silva@email.com",
  "mensagem": "Olá! Gostaria de agendar uma visita..."
}
```

### 2. 📧 Enviar Mensagem - Exemplo Mínimo
- Mesma rota, com dados mínimos para teste rápido

### 3. 📧 Enviar Mensagem - Teste de Validação
- Testa as validações do endpoint (deve retornar erro 400)

## ⚙️ Configuração

### Variável de Ambiente

A collection usa a variável `{{baseUrl}}` que por padrão está configurada como:
- `http://localhost:3003`

Para alterar:
1. Clique na collection
2. Vá em **Variables**
3. Altere o valor de `baseUrl` conforme necessário

## ✅ Respostas Esperadas

### Sucesso (200)
```json
{
  "mensagem": "Mensagem enviada com sucesso! Entraremos em contato em breve.",
  "status": "sucesso"
}
```

### Erro de Validação (400)
```json
{
  "mensagem": "Campos obrigatórios ausentes: nome, email"
}
```

ou

```json
{
  "mensagem": "E-mail inválido."
}
```

### Erro do Servidor (500)
```json
{
  "mensagem": "Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato pelo telefone.",
  "detalhes": "Detalhes do erro (apenas em desenvolvimento)"
}
```

## 🔍 Campos Obrigatórios

- `nome` (string): Nome completo do remetente
- `telefone` (string): Telefone para contato
- `email` (string): Email válido do remetente
- `mensagem` (string): Mensagem do contato

## 📝 Notas Importantes

1. **Não requer autenticação** - Esta rota é pública
2. **Validação de email** - O email deve estar em formato válido
3. **Configuração de email** - Certifique-se de que as variáveis de ambiente do backend estão configuradas (veja `EMAIL_SETUP.md`)
4. **Email de destino** - As mensagens são enviadas para o email configurado em `EMAIL_DESTINO` no `.env`

## 🧪 Testando

1. Certifique-se de que o servidor backend está rodando
2. Configure as variáveis de ambiente do email (veja `EMAIL_SETUP.md`)
3. Importe a collection no Postman
4. Execute a requisição "Enviar Mensagem de Contato"
5. Verifique se o email chegou na caixa de entrada configurada

## 🐛 Troubleshooting

### Erro 500 - "Erro ao enviar mensagem"
- Verifique se as variáveis de ambiente do email estão configuradas
- Verifique os logs do servidor para mais detalhes
- Consulte `EMAIL_SETUP.md` para configuração

### Erro 400 - "Campos obrigatórios ausentes"
- Verifique se todos os campos estão presentes no body
- Verifique se nenhum campo está vazio

### Email não chega
- Verifique a pasta de spam
- Verifique se `EMAIL_DESTINO` está correto no `.env`
- Verifique os logs do servidor

