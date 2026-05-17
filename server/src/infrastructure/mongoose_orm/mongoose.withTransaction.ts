import { AppError } from '#utils/AppError.js'
import mongoose from 'mongoose'

export const withTransaction = async <T>(
  fn: (session: mongoose.ClientSession) => Promise<T>,
  existingSession?: mongoose.ClientSession): Promise<T> => {

  const isRoot = !existingSession
  const session = existingSession ?? await mongoose.startSession()
  if (isRoot) session.startTransaction()

  try {
    const result = await fn(session)

    if (isRoot) await session.commitTransaction()
    return result

  } catch (err: any) {
    if (err.code === 11000) {
      if (isRoot) await session.abortTransaction()
      throw new AppError('This media is already linked to this mushroom.')
    }

    if (isRoot) await session.abortTransaction()
    throw err

  } finally {
    if (isRoot) session.endSession()
  }
}
