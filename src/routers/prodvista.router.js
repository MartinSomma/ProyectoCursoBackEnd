import {Router} from 'express'
import ProductManager from '../entregable2.js'


const router = Router()
const manager = new ProductManager('./products.json');

router.get('/', (request,response) => {
    
    
    manager.getProducts().then((data) => {
            response.status(200).render('index', {data})
    })
    
})


export default router
