# Correção de CORS no Easypanel

## Problema
Erro de CORS persistente mesmo após correções no código:
```
Access to XMLHttpRequest at 'https://pinguinho-pingback-test.hvko68.easypanel.host/auth/login' 
from origin 'https://pinguinho-pingfront-test.hvko68.easypanel.host' has been blocked by CORS policy
```

## Possíveis Causas no Easypanel

O Easypanel pode estar fazendo proxy reverso e pode estar:
1. Bloqueando requisições OPTIONS (preflight)
2. Não repassando headers CORS corretamente
3. Interferindo com os headers de resposta

## Soluções

### 1. Verificar Configuração do Easypanel

No painel do Easypanel, verifique:
- Se há configuração de proxy reverso
- Se há regras de firewall bloqueando OPTIONS
- Se há configurações de CORS no nível do proxy

### 2. Configurar Variáveis de Ambiente

No Easypanel, adicione as seguintes variáveis de ambiente:

```env
FRONTEND_URL=https://pinguinho-pingfront-test.hvko68.easypanel.host
CORS_ORIGIN=https://pinguinho-pingfront-test.hvko68.easypanel.host
NODE_ENV=production
```

### 3. Verificar Logs do Servidor

Após fazer o deploy, verifique os logs do servidor para ver:
- Se as requisições OPTIONS estão chegando
- Qual origem está sendo recebida
- Se os headers estão sendo definidos

### 4. Testar Endpoint de CORS

Acesse no navegador ou Postman:
```
GET https://pinguinho-pingback-test.hvko68.easypanel.host/cors-test
```

Este endpoint retorna informações sobre a configuração de CORS.

### 5. Configuração no Nginx/Proxy (se aplicável)

Se o Easypanel usar Nginx como proxy, pode ser necessário adicionar headers no nível do proxy. Verifique se há configuração de Nginx no Easypanel.

### 6. Solução Alternativa: Desabilitar CORS no Easypanel

Se o Easypanel tiver uma opção para desabilitar CORS no nível do proxy, desabilite e deixe o Node.js gerenciar completamente.

## Debug

1. **Teste direto no servidor:**
   ```bash
   curl -X OPTIONS https://pinguinho-pingback-test.hvko68.easypanel.host/auth/login \
     -H "Origin: https://pinguinho-pingfront-test.hvko68.easypanel.host" \
     -H "Access-Control-Request-Method: POST" \
     -v
   ```

2. **Verifique os headers de resposta:**
   - Deve retornar `Access-Control-Allow-Origin`
   - Deve retornar `Access-Control-Allow-Methods`
   - Deve retornar status 204 para OPTIONS

3. **Verifique os logs do servidor:**
   - Procure por mensagens de CORS
   - Verifique se as requisições OPTIONS estão chegando

## Mudanças Aplicadas no Código

1. ✅ Middleware CORS global como primeiro middleware
2. ✅ Tratamento explícito de requisições OPTIONS
3. ✅ Headers CORS em TODAS as respostas
4. ✅ Logs detalhados para debug
5. ✅ Endpoint de teste `/cors-test`

## Próximos Passos

1. Fazer deploy do backend com as alterações
2. Verificar variáveis de ambiente no Easypanel
3. Testar o endpoint `/cors-test`
4. Verificar logs do servidor
5. Se ainda não funcionar, verificar configurações do proxy no Easypanel

