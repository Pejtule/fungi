import express, { type Application } from 'express'
import cors from '#middleware/cors.js'

import { configRouter } from '#infra/http/config.js'
import { healthRouter } from '#infra/http/health.js'
import { liveRouter } from '#infra/http/live.js'
import { readyRouter } from '#infra/http/ready.js'

import { apiRouter } from './api/api.routes.js'
import { taxonRouter } from '#modules/taxon/taxon.routes.js'
import { mediaRouter } from '#modules/media/media.routes.js'

import { errorHandler } from '#middleware/errorHandler.js'
import { normalizeQuery } from '#middleware/normalizeQuery.js'
import { pinoHttp } from 'pino-http'
import { logger } from '#utils/logger.js'
import cookieParser from 'cookie-parser'

const app: Application = express()

app.use(express.json())
app.use(cors)
app.use(cookieParser())


app.set('etag', false)
app.use(normalizeQuery)
app.use(pinoHttp({ logger }))

app.use(configRouter)
app.use(healthRouter)
app.use(liveRouter)
app.use(readyRouter)

app.use('/api', apiRouter)
app.use('/taxa', taxonRouter)
app.use('/media', mediaRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  })
})

app.use(errorHandler)

export default app
