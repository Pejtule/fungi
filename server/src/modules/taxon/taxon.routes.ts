import { Router } from 'express'
import type { Router as RouterType } from 'express'
import * as taxonController from './taxon.controller.js'
import { validateUUIDParam } from '#middleware/validateUUIDParam.js'

export const taxonRouter: RouterType = Router()

taxonRouter.post('/', taxonController.create)
taxonRouter.get('/', taxonController.list)
taxonRouter.get('/:id', validateUUIDParam('id'), taxonController.get)
taxonRouter.patch('/:id', validateUUIDParam('id'), taxonController.update)
taxonRouter.delete('/:id', validateUUIDParam('id'), taxonController.remove)
