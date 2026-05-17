import { Router } from 'express'
import type { Router as RouterType } from 'express'
import * as apiMushroomController from './api.mushroom.controller.js'
import { validateUUIDParam } from '#middleware/validateUUIDParam.js'

export const apiMushroomRouter: RouterType = Router()

apiMushroomRouter.post('/', apiMushroomController.create)
apiMushroomRouter.get('/', apiMushroomController.list)
apiMushroomRouter.get('/:id', validateUUIDParam('id'), apiMushroomController.get)
apiMushroomRouter.patch('/:id', validateUUIDParam('id'), apiMushroomController.update)
apiMushroomRouter.delete('/:id', validateUUIDParam('id'), apiMushroomController.remove)
