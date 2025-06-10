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
    npm run build && \
    rm -rf src/ tests/ prisma/ tsconfig*.json

# Estágio de produção
FROM node:20-alpine

WORKDIR /app

# Instala apenas o necessário para rodar a aplicação
RUN apk add --no-cache tini

# Copia apenas os arquivos necessários do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Remove dev dependencies e arquivos desnecessários
RUN npm prune --production && \
    npm cache clean --force && \
    rm -rf /root/.npm

# Usa tini como entrypoint para melhor gerenciamento de processos
ENTRYPOINT ["/sbin/tini", "--"]

# Expõe a porta da aplicação
EXPOSE 3000

# Define usuário não-root
USER node

# Comando para iniciar a aplicação
CMD ["npm", "start"] 