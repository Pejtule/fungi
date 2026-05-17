import type { Request, Response, NextFunction } from 'express'
import { AppError } from '#utils/AppError.js'
import { logger } from '#utils/logger.js'
import { NODE_ENV } from '#config/env.js'

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = (err as AppError).status ?? 500
  const isDev = NODE_ENV !== 'production'
  console.log('ERR TYPE:', err.constructor.name)
  console.log('ERR INSTANCEOF AppError:', err instanceof AppError)


  logger.error({
    message: err.message,
    status,
    method: req.method,
    path: req.originalUrl,
    stack: err.stack,
    details: (err as AppError).details || null
  })

  const response: Record<string, unknown> = {
    success: false,
    message: (err as AppError).publicMessage || err.message || 'Internal server error.'
  }

  if (isDev) {
    response.stack = err.stack
    if ((err as AppError).details) {
      response.details = (err as AppError).details
    }
  }

  res.status(status).json(response)
}
