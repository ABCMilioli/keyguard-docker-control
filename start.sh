#!/bin/sh

# Espera o banco de dados estar pronto
echo "Aguardando o banco de dados..."
sleep 10

# Cria as tabelas diretamente
echo "Criando tabelas..."
psql $DATABASE_URL -f prisma/create_tables.sql

# Inicia a aplicação
echo "Iniciando a aplicação..."
npm start 