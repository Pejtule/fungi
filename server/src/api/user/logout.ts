import type { Request, Response } from 'express'

export function logoutHandler(req: Request, res: Response) {
  res.clearCookie('auth')
  res.json({ success: true })
}
