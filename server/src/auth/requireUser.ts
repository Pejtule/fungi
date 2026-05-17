import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from './jwt.js'

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.auth

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const payload = verifyToken(token)
    req.user = payload
  } catch {
    req.user = null
  }

  next()
}
