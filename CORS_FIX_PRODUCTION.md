# 🔧 Correção de CORS em Produção (Easypanel)

## 🚨 Problema

Erro de CORS em produção:
```
Access to XMLHttpRequest at 'https://pinguinho-pingback.hvko68.easypanel.host/auth/login' 
from origin 'https://pinguinho-pingfront.hvko68.easypanel.host' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Correções Aplicadas no Código

### 1. Middleware CORS Robusto
- ✅ Headers CORS definidos em TODAS as requisições
- ✅ Tratamento explícito de requisições OPTIONS (preflight)
- ✅ Headers duplicados usando `res.setHeader()` e `res.header()` para garantir envio
- ✅ Middleware de erro global que garante CORS mesmo em erros
- ✅ Middleware 404 que garante CORS mesmo para rotas não encontradas

### 2. Configuração do Pacote CORS
- ✅ `preflightContinue: false` - garante que OPTIONS não passe para outros middlewares
- ✅ Permite qualquer origem (controlado pelo middleware manual)

## 📋 Checklist de Verificação no Easypanel

### 1. Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas no Easypanel:

```env
NODE_ENV=production
FRONTEND_URL=https://pinguinho-pingfront.hvko68.easypanel.host
CORS_ORIGIN=https://pinguinho-pingfront.hvko68.easypanel.host
```

**Como verificar:**
1. Acesse o painel do Easypanel
2. Vá para a configuração do serviço `pingback`
3. Verifique a seção "Environment Variables"
4. Adicione/atualize as variáveis acima

### 2. Configuração do Proxy/Ingress

O Easypanel pode estar usando um proxy reverso (Nginx/Traefik) que está interferindo com CORS.

**Verifique:**
1. Se há configuração de Ingress/Proxy no Easypanel
2. Se há regras de firewall bloqueando requisições OPTIONS
3. Se o proxy está repassando headers CORS corretamente

### 3. Teste o Endpoint de CORS

Após fazer deploy, teste o endpoint:

```bash
curl -X GET https://pinguinho-pingback.hvko68.easypanel.host/cors-test \
  -H "Origin: https://pinguinho-pingfront.hvko68.easypanel.host" \
  -v
```

**O que verificar na resposta:**
- ✅ Status 200
- ✅ Header `Access-Control-Allow-Origin` presente
- ✅ Header `Access-Control-Allow-Credentials: true`
- ✅ Header `Access-Control-Allow-Methods` presente

### 4. Teste o Preflight (OPTIONS)

```bash
curl -X OPTIONS https://pinguinho-pingback.hvko68.easypanel.host/auth/login \
  -H "Origin: https://pinguinho-pingfront.hvko68.easypanel.host" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v
```

**O que verificar:**
- ✅ Status 204 (No Content)
- ✅ Header `Access-Control-Allow-Origin` presente
- ✅ Header `Access-Control-Allow-Methods` contém POST
- ✅ Header `Access-Control-Allow-Headers` presente
- ✅ Header `Access-Control-Allow-Credentials: true`

### 5. Verificar Logs do Servidor

Após fazer uma requisição, verifique os logs do servidor no Easypanel. Você deve ver:

```
🌐 CORS Request: OPTIONS /auth/login
📍 Origin recebida: https://pinguinho-pingfront.hvko68.easypanel.host
📋 Origens permitidas: ...
✅ CORS Preflight OPTIONS respondido para: https://pinguinho-pingfront.hvko68.easypanel.host
📤 Headers enviados: Access-Control-Allow-Origin=https://pinguinho-pingfront.hvko68.easypanel.host
```

## 🔍 Debug Adicional

### Se o problema persistir:

1. **Verifique se o servidor está recebendo requisições OPTIONS:**
   - Os logs devem mostrar `🌐 CORS Request: OPTIONS`
   - Se não aparecer, o proxy pode estar bloqueando

2. **Verifique se os headers estão sendo enviados:**
   - Use o endpoint `/cors-test` para verificar
   - Verifique os headers na resposta

3. **Teste direto no servidor (se tiver acesso SSH):**
   ```bash
   curl -X OPTIONS http://localhost:3003/auth/login \
     -H "Origin: https://pinguinho-pingfront.hvko68.easypanel.host" \
     -v
   ```

4. **Verifique configuração do Ingress no Easypanel:**
   - Se houver configuração de Ingress, verifique se está repassando headers
   - Pode ser necessário adicionar annotations específicas

## 🚀 Próximos Passos

1. ✅ Fazer deploy do backend com as correções
2. ✅ Verificar variáveis de ambiente no Easypanel
3. ✅ Testar endpoint `/cors-test`
4. ✅ Testar preflight OPTIONS
5. ✅ Verificar logs do servidor
6. ✅ Se necessário, verificar configuração do proxy/ingress no Easypanel

## 📝 Notas Importantes

- O middleware CORS é o **PRIMEIRO** middleware (antes de qualquer outro)
- Requisições OPTIONS são respondidas **IMEDIATAMENTE** sem passar para outros middlewares
- Headers CORS são definidos em **TODAS** as respostas, incluindo erros
- Com `credentials: true`, não podemos usar `*` como origem, deve ser a origem exata

## 🔗 Referências

- [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Easypanel Documentation](https://easypanel.io/docs)

