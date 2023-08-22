import {Router} from 'express'
import { viewRegistroController } from '../controllers/views.controller.js'

const router = Router()

router.get('/', viewRegistroController )

export default router