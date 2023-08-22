import {Router} from 'express'
import Carrito from '../cart.js'
import cartModel from '../dao/models/cart.model.js'
import productModel from '../dao/models/products.model.js'
import { cartCreateController, 
        cartViewAllController, 
        cartByIDController,
        cartAddProductController,
        cartDeleteProductsController,
        cartDeleteProductByIDController,
        cartUpdateProductQtyController,
        cartAddProductsController } from '../controllers/carrito.controllers.js'

const router = Router()

// endpoint para ver carrito x ID
router.get('/:cid', cartByIDController)

//endpoint para crear carrito vacio, devuelve id del carrito
router.post('/', cartCreateController)

// endpoint para ver todos los carritos -- NO PEDIDO, SOLO POR COMODIDAD --
router.get('/', cartViewAllController)

// endpoint para agregar producto en un carrito
router.post('/:cid/product/:pid', cartAddProductController )

//eliminar todos los productos del carrito
router.delete('/:cid', cartDeleteProductsController )

//eliminar del carrito el producto indicado x id
router.delete('/:cid/product/:pid', cartDeleteProductByIDController )

//endpoint para agregar por body la cantidad a un producto en un carrito
router.put('/:cid/product/:pid', cartUpdateProductQtyController)

// endpint para agregar producto/qty por body
router.put( '/:cid', cartAddProductsController )




export default router