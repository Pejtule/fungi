import { Router } from 'express'
import type { Router as RouterType } from 'express'

export const apiMeRouter: RouterType = Router()

apiMeRouter.get('/')