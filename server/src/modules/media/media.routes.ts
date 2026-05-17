import { Router } from 'express'
import type { Router as RouterType } from 'express'
import * as mediaController from './media.controller.js'
import { validateUUIDParam } from '#middleware/validateUUIDParam.js'

export const mediaRouter: RouterType = Router()

mediaRouter.post('/', mediaController.create)
mediaRouter.get('/', mediaController.list)
mediaRouter.get('/:id', validateUUIDParam('id'), mediaController.get)
mediaRouter.patch('/:id', validateUUIDParam('id'), mediaController.update)
mediaRouter.delete('/:id', validateUUIDParam('id'), mediaController.remove)
