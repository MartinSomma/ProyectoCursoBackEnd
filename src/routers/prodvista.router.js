import {Router} from 'express'
import { viewProductsController } from '../controllers/views.controller.js'
import { auth2Controller } from '../middlewares/user.middleware.js'

const router = Router()

router.get('/', auth2Controller, viewProductsController)

export default router
