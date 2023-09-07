import {Router} from 'express'
import { generateProducts } from '../utils.js'

const router = Router()

//endpoint para consultar todos los productos
router.get('/', (req,res) => {
    let products=[]
    for (let index = 0; index < 100; index++) {
        products.push(generateProducts())    
    }
    res.send(products)
    
} )

export default router