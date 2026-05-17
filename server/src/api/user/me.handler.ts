import type { Request, Response } from 'express'

export function meHandler(req: Request, res: Response) {
  res.json(req.user ?? null)
}
