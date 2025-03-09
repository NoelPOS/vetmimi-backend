import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    if (!process.env.MONGO) {
      throw new Error('MONGO environment variable is not defined')
    }

    await mongoose.connect(process.env.MONGO)
    isConnected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}
