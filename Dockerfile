# Dockerfile para Backend - Ping API
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm ci --only=production && \
    npm ci --only=development

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build || npx tsc

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar arquivos compilados do stage anterior
COPY --from=builder /app/build ./build

# Copiar knexfile e migrations (necessários para migrations em produção)
COPY knexfile.js ./
COPY migrations ./migrations

# Criar usuário não-root por segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expor porta
EXPOSE 3003

# Variável de ambiente padrão
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3003/', (r) => {if(r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para iniciar (migrations + start)
CMD ["sh", "-c", "npm run migrate && node build/index.js"]

