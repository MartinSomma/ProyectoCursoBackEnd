import { Router } from  'express'
import { viewRealTimeProductsController } from '../controllers/views.controller.js'

const router = Router()

router.get('/', viewRealTimeProductsController)

export default router