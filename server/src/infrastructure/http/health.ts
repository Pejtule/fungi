import { Router } from 'express'
import type { Router as RouterType } from 'express'
import mongoose from 'mongoose'
import pkg from '../../../package.json' with { type: 'json' }

export const healthRouter: RouterType = Router()

healthRouter.get('/health', async (req, res) => {
  if (!mongoose.connection.db) {
    return res.status(503).json({
      status: 'error',
      version: pkg.version,
      db: 'initializing',
      timestamp: new Date().toISOString(),
    })
  }

  try {
    await mongoose.connection.db.admin().ping()

    res.status(200).json({
      status: 'ok',
      version: pkg.version,
      db: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      version: pkg.version,
      db: 'disconnected',
      timestamp: new Date().toISOString(),
    })
  }
})
