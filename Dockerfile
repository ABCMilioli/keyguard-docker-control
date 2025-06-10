# Estágio de build
FROM node:20-alpine as builder

WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instala todas as dependências (incluindo as de desenvolvimento)
RUN npm ci && \
    npm cache clean --force && \
    rm -rf /root/.npm

# Copia o código fonte
COPY . .

# Gera o Prisma Client e faz o build
RUN npx prisma generate && \
    npm run build

# Estágio de produção
FROM node:20-alpine

WORKDIR /app

# Instala apenas o necessário para rodar a aplicação
RUN apk add --no-cache tini postgresql-client

# Copia os arquivos necessários do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY start.sh ./start.sh

# Torna o script executável
RUN chmod +x /app/start.sh && \
    # Instala o cliente Prisma em produção
    npm install @prisma/client && \
    # Gera o cliente Prisma
    npx prisma generate && \
    # Remove dev dependencies e arquivos desnecessários
    npm prune --production && \
    npm cache clean --force && \
    rm -rf /root/.npm

# Usa tini como entrypoint para melhor gerenciamento de processos
ENTRYPOINT ["/sbin/tini", "--"]

# Expõe a porta da aplicação
EXPOSE 3000

# Define usuário não-root
USER node

# Comando para iniciar a aplicação usando o script
CMD ["/app/start.sh"] 