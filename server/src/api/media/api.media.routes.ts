import { Router } from 'express'
import type { Router as RouterType } from 'express'
import * as apiMediaController from './api.media.controller.js'
import { validateUUIDParam } from '#middleware/validateUUIDParam.js'

export const apiMediaRouter: RouterType = Router()

apiMediaRouter.post('/upload', apiMediaController.upload) 
apiMediaRouter.get('/image/:id', validateUUIDParam('id'), apiMediaController.getImage)
apiMediaRouter.patch('/image/:id/crop', validateUUIDParam('id'), apiMediaController.addImageCrop)
