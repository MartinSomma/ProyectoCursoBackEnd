import {Router} from 'express'
import {viewCartByIDController } from '../controllers/views.controller.js'


const router = Router()

//vista de carrito x ID 
router.get('/:cid', viewCartByIDController)

export default router