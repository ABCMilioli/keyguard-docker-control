-- Drop all tables first to avoid foreign key constraints
DROP TABLE IF EXISTS "instalacoes" CASCADE;
DROP TABLE IF EXISTS "chaves_api" CASCADE;
DROP TABLE IF EXISTS "clientes" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Clean migration history
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE; 