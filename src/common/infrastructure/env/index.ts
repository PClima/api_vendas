import { AppError } from '@/common/domain/errors/app-error'
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'), // 3 possible values, default is 'development'
  PORT: z.coerce.number().default(3333), // Checking if port env variable is a number, default is 3333
  API_URL: z.string().default('http://localhost:3333'), // Checking if API_URL env variable is a string, default is 'http://localhost:3333'
  DB_TYPE: z.literal('postgres').default('postgres'), // Checking if DB_TYPE env variable is a string, default is 'postgres'
  DB_HOST: z.string().default('localhost'), // Checking if DB_HOST env variable is a string, default is 'localhost'
  DB_PORT: z.coerce.number().default(5432), // Checking if DB_PORT env variable is a number, default is 5432
  DB_SCHEMA: z.string().default('public'), // Checking if DB_SCHEMA env variable is a string, default is 'public'
  DB_NAME: z.string().default('postgres'), // Checking if DB_NAME env variable is a string, default is 'postgres'
  DB_USER: z.string().default('postgres'), // Checking if DB_USER env variable is a string, default is 'postgres'
  DB_PASS: z.string().default('postgres'), // Checking if DB_PASSWORD env variable is a string, default is 'postgres'
  JWT_SECRET: z.string().default('secret'), // Checking if JWT_SECRET env variable is a string, default is 'secret'
  JWT_EXPIRES_IN: z.coerce.number().default(86400), // Checking if JWT_EXPIRES_IN env variable is a nu,ber, default is 1 day in seconds
  BUCKET_NAME: z.string(), // Checking if BUCKET_NAME env variable is a string
  AWS_REGION: z.string(), // Checking if AWS_REGION env variable is a string
  AWS_ACCESS_KEY_ID: z.string(), // Checking if AWS_ACCESS_KEY_ID env variable is a string
  AWS_SECRET_ACCESS_KEY: z.string(), // Checking if AWS_SECRET_ACCESS_KEY env variable is a string
  BUCKET_LINK: z.string(), // Checking if BUCKET_LINK env variable is a string
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  throw new AppError('Invalid environment variables') // If any of the env variables are invalid
}

export const env = _env.data
