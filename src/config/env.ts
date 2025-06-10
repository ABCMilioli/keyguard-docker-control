import { z } from 'zod';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Schema de validação das variáveis de ambiente
const envSchema = z.object({
  // Configurações do Banco de Dados
  DATABASE_URL: z.string().min(1).default('postgresql://postgres:131489152850082175195580@postgres:5432/keyguard?schema=public'),

  // Configurações do Servidor
  PORT: z.string().transform(Number).default('3000'),

  // Configurações do Host
  API_HOST: z.string().min(1).default('your-domain.com'),
  USE_TLS: z.string().transform(val => val === 'true').default('true'),
});

// Tipo das variáveis de ambiente validadas
type EnvConfig = z.infer<typeof envSchema>;

// Função para validar e retornar as variáveis de ambiente
export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(`❌ Invalid environment variables:\n${missingVars}`);
    }
    throw error;
  }
}

// Exporta as variáveis de ambiente validadas
export const env = validateEnv();

// Exemplo de uso:
// import { env } from '../config/env';
// console.log(env.PORT); // número (3000)
// console.log(env.API_HOST); // string ('your-domain.com')
// console.log(env.USE_TLS); // boolean (true)
// console.log(env.DATABASE_URL); // string (URL do banco de dados) 