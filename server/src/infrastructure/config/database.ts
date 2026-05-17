import { connectMongo } from '../db/mongo.client.js'
import { MONGO_URI } from './env.js'

export const connectDB = async () => {
  await connectMongo(MONGO_URI)
  console.log('📦 MongoDB connected.')
}
