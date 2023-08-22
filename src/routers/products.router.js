import {Router} from 'express'
import { getProductsController,
        getProductByIDController,
        createProductController,
        updateProductController,
        deleteProductByIdController} from '../controllers/product.controllers.js'


const router = Router()

//endpoint para consultar todos los productos
router.get('/', getProductsController )

//endpoint para ver una producto x id
router.get('/:pid', getProductByIDController ) 

//endpoint para crear nuevo producto
router.post('/', createProductController )

//endpoint para actualizar los datos de un producto
router.put('/:pid', updateProductController )

//endpoint para borrar producto x id
router.delete('/:pid', deleteProductByIdController )


export default router
