import {Router} from 'express'
import { getProductsController,
        getProductByIDController,
        createProductController,
        updateProductController,
        deleteProductByIdController} from '../controllers/product.controllers.js'
import { handlePolicies } from '../middlewares/policies.middleware.js'

const router = Router()

//endpoint para consultar todos los productos
router.get('/', getProductsController )

//endpoint para ver un producto x id. prueba admin
router.get('/:pid', handlePolicies(['admin', 'user']), getProductByIDController ) 

//endpoint para crear nuevo producto, admin
router.post('/', handlePolicies(['admin']), createProductController )

//endpoint para actualizar los datos de un producto, admin
router.put('/:pid', handlePolicies(['admin']), updateProductController )

//endpoint para borrar producto x id, admin
router.delete('/:pid', handlePolicies(['admin']), deleteProductByIdController )


export default router
