import { Router } from 'express'
import { apiMushroomRouter } from './mushroom/api.mushroom.routes.js'
import { apiTaxonRouter } from './taxon/api.taxon.routes.js'
import { apiMediaRouter } from './media/api.media.routes.js'
import { meHandler } from './user/me.handler.js'
import { loginHandler } from './user/login.js'
import { logoutHandler } from './user/logout.js'
import { requireUser } from '../auth/requireUser.js'

export const apiRouter: Router = Router()

apiRouter.use('/mushrooms', apiMushroomRouter)
apiRouter.use('/taxa', apiTaxonRouter)
apiRouter.use('/media', apiMediaRouter)
apiRouter.use('/me',requireUser, meHandler)
apiRouter.post('/login', loginHandler)
apiRouter.post('/logout', logoutHandler)
