import { z } from 'zod'

export const prodEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.string().default('3000'),
  LOG_LEVEL: z.string().default('info'),
  API_URL: z.string(),
  MONGO_URI: z.string(),
  S3_ENDPOINT: z.string(),
  S3_KEY: z.string(),
  S3_SECRET: z.string(),
  S3_BUCKET: z.string().default('uploads'),
})

export type Env = z.infer<typeof prodEnvSchema>
