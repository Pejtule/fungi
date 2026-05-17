import dotenv from 'dotenv'
import { devEnvSchema } from './env.schema.dev.js'
import { prodEnvSchema } from './env.schema.prod.js'

const isProd = process.env.NODE_ENV === 'production'

if (!isProd) {
  dotenv.config({ path: '.env' })
} else {
  dotenv.config({ path: '.env.production' })
}

const parsed = isProd ? prodEnvSchema.safeParse(process.env) : devEnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const ENV = parsed.data

export const NODE_ENV = ENV.NODE_ENV
export const PORT = Number(ENV.PORT)
export const LOG_LEVEL = ENV.LOG_LEVEL
export const API_URL = ENV.API_URL

export const MONGO_URI = ENV.MONGO_URI

export const S3_ENDPOINT = ENV.S3_ENDPOINT
export const S3_KEY = ENV.S3_KEY
export const S3_SECRET = ENV.S3_SECRET
export const S3_BUCKET = ENV.S3_BUCKET
