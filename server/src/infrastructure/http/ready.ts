import { Router } from 'express'
import type { Router as RouterType } from 'express'
import mongoose from 'mongoose'

export const readyRouter: RouterType = Router()

readyRouter.get('/ready', async (req, res) => {
  if (!mongoose.connection.db) {
    return res.status(503).json({
      status: 'not-ready',
      db: 'initializing',
      timestamp: new Date().toISOString(),
    })
  }

  try {
    await mongoose.connection.db.admin().ping()

    res.status(200).json({
      status: 'ready',
      db: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch {
    res.status(500).json({
      status: 'not-ready',
      db: 'disconnected',
      timestamp: new Date().toISOString(),
    })
  }
})
