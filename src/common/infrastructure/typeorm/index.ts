import { DataSource } from 'typeorm'
import { env } from '../env'

export const dataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  schema: env.DB_SCHEMA,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  entities: ['**/entities/**/*.ts'],
  migrations: ['**/migrations/**/*.ts'],
  synchronize: false,
})
