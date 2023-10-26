import {Router} from 'express'
import { generateProducts } from '../utils.js'
import { createProductController } from '../controllers/product.controllers.js'
import { ProdcutService } from '../services/product.service.js'

const router = Router()

//endpoint para consultar todos los productos
router.get('/', async(req,res) => {
    
    let products=[]
    for (let index = 0; index < 100; index++) {
        products.push(generateProducts())    
    }

    //Descomentar para cargar productos
    //let resCreate
    //for( const prod of products) {
    //    resCreate = await ProdcutService.create(prod)
    //}

    res.send(products)
    
} )

export default router