-- Create tables if they don't exist
DO $$ 
BEGIN
    -- Create users table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE "users" (
            "id" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "nome" TEXT NOT NULL,
            "senha" TEXT NOT NULL,
            "role" TEXT NOT NULL DEFAULT 'user',
            "ativo" BOOLEAN NOT NULL DEFAULT true,
            "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "dataAtualizacao" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "users_pkey" PRIMARY KEY ("id")
        );
        
        -- Create index
        CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
    END IF;

    -- Create clientes table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'clientes') THEN
        CREATE TABLE "clientes" (
            "id" TEXT NOT NULL,
            "nome" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "senha" TEXT NOT NULL,
            "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
        );
        
        -- Create index
        CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");
    END IF;

    -- Create chaves_api table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chaves_api') THEN
        CREATE TABLE "chaves_api" (
            "id" TEXT NOT NULL,
            "chave" TEXT NOT NULL,
            "nome" TEXT NOT NULL,
            "descricao" TEXT NOT NULL,
            "clienteId" TEXT NOT NULL,
            "limiteInstalacoes" INTEGER NOT NULL DEFAULT 10,
            "instalacoesAtuais" INTEGER NOT NULL DEFAULT 0,
            "ativa" BOOLEAN NOT NULL DEFAULT true,
            "ultimoHeartbeat" TIMESTAMP(3),
            "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "chaves_api_pkey" PRIMARY KEY ("id")
        );
        
        -- Create index
        CREATE UNIQUE INDEX "chaves_api_chave_key" ON "chaves_api"("chave");
    END IF;

    -- Create instalacoes table if not exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'instalacoes') THEN
        CREATE TABLE "instalacoes" (
            "id" TEXT NOT NULL,
            "dispositivoId" TEXT NOT NULL,
            "chaveApiId" TEXT NOT NULL,
            "clienteId" TEXT NOT NULL,
            "enderecoIP" TEXT NOT NULL,
            "infoDispositivo" JSONB NOT NULL,
            "ativa" BOOLEAN NOT NULL DEFAULT true,
            "ultimoHeartbeat" TIMESTAMP(3),
            "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "instalacoes_pkey" PRIMARY KEY ("id")
        );
        
        -- Create index
        CREATE UNIQUE INDEX "instalacoes_chaveApiId_dispositivoId_key" ON "instalacoes"("chaveApiId", "dispositivoId");
    END IF;
END $$;

-- Add foreign keys if they don't exist
DO $$
BEGIN
    -- Add foreign key for chaves_api.clienteId if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'chaves_api_clienteId_fkey'
    ) THEN
        ALTER TABLE "chaves_api" 
        ADD CONSTRAINT "chaves_api_clienteId_fkey" 
        FOREIGN KEY ("clienteId") 
        REFERENCES "clientes"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    -- Add foreign key for instalacoes.chaveApiId if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'instalacoes_chaveApiId_fkey'
    ) THEN
        ALTER TABLE "instalacoes" 
        ADD CONSTRAINT "instalacoes_chaveApiId_fkey" 
        FOREIGN KEY ("chaveApiId") 
        REFERENCES "chaves_api"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    -- Add foreign key for instalacoes.clienteId if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'instalacoes_clienteId_fkey'
    ) THEN
        ALTER TABLE "instalacoes" 
        ADD CONSTRAINT "instalacoes_clienteId_fkey" 
        FOREIGN KEY ("clienteId") 
        REFERENCES "clientes"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$; 