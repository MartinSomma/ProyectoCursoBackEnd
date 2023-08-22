import {Router} from 'express'
import { viewLoginController } from '../controllers/views.controller.js'

const router = Router()

router.get('/', viewLoginController )

export default router