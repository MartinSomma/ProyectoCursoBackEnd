import {Router} from 'express'
import { resetPasswordController } from '../controllers/views.controller.js'

const router = Router()

router.get('/', resetPasswordController )

export default router