import { z } from 'zod'

export const devEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  LOG_LEVEL: z.string().catch('debug'),
  API_URL: z.string().catch('http://localhost:3000/api'),
  
  MONGO_URI: z.string().catch('mongodb://mongo:27017/mushroomsdb?replicaSet=rs0&directConnection=true'),

  S3_ENDPOINT: z.string().catch('http://localhost:9000'),
  S3_KEY: z.string().catch('minioadmin'),
  S3_SECRET: z.string().catch('minioadmin'),
  S3_BUCKET: z.string().default('uploads'),
})

export type Env = z.infer<typeof devEnvSchema>
