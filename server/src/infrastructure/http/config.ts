import { Router } from 'express'
import type { Router as RouterType } from 'express'
import pkg from '../../../package.json' with { type: 'json' }
import { API_URL, NODE_ENV } from '#config/env.js'

export const configRouter: RouterType = Router()

configRouter.get('/config', (req, res) => {
  res.status(200).json({
    apiUrl: API_URL,
    version: pkg.version,
    env: NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})
