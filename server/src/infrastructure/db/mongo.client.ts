import mongoose from 'mongoose'

export const connectMongo = async (uri: string) => {
  console.log('Connecting to MongoDB:', uri)

  if (mongoose.connection.readyState === 1) {
    console.log('Mongo already connected.')
    return
  }

  try {
    await mongoose.connect(uri, { autoIndex: true })
    console.log('MongoDB connected successfully.')
  } catch (err) {
    console.error('MongoDB connection error:', err)
  }
}
