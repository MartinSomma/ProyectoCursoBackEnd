import {Router} from 'express'
import {viewUsersController } from '../controllers/views.controller.js'
import { handlePolicies } from '../middlewares/policies.middleware.js'

const router = Router()

router.get('/', handlePolicies(['admin']), viewUsersController)

export default router