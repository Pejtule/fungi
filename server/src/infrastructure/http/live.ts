import { Router } from 'express'
import type { Router as RouterType } from 'express'

export const liveRouter: RouterType = Router()

liveRouter.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  })
})
