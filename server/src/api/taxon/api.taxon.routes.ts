import { Router } from 'express'
import type { Router as RouterType } from 'express'
import * as apiTaxonController from './api.taxon.controller.js'

export const apiTaxonRouter: RouterType = Router()

apiTaxonRouter.get('/rank', apiTaxonController.rank)
apiTaxonRouter.get('/children', apiTaxonController.children)
apiTaxonRouter.get('/resolve', apiTaxonController.resolve)
