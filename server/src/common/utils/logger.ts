import pino from 'pino'
import { NODE_ENV } from '#config/env.js'

const isProd = NODE_ENV === 'production'

export const logger = pino(
  isProd
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
)
