import { AppError } from '#utils/AppError.js'
import type { Request, Response, NextFunction, RequestHandler } from 'express'
import { z } from 'zod'
import { uuidSchema } from '../schemas/module.schema.js'


export function validateUUIDParam(paramName: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      uuidSchema.parse(req.params[paramName])
      next()
    } catch {
      next(new AppError('Invalid ID format', 404, 'Záznam nenalezen.'))
    }
  }
}
