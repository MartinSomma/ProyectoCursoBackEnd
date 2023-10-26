import {Router} from 'express'
import { handlePolicies } from '../middlewares/policies.middleware.js'
import { cartCreateController, 
        cartViewAllController, 
        cartByIDController,
        cartAddProductController,
        cartDeleteProductsController,
        cartDeleteProductByIDController,
        cartUpdateProductQtyController,
        cartAddProductsController,
        cartPurchaseController,
        cartPurchasePreviewController
        } from '../controllers/carrito.controllers.js'

const router = Router()

// endpoint para ver carrito x ID - getById 
router.get('/:cid', cartByIDController)

//endpoint para crear carrito vacio, devuelve id del carrito - create
router.post('/', cartCreateController)

// endpoint para ver todos los carritos -- NO PEDIDO, SOLO POR COMODIDAD -- getAll
router.get('/', cartViewAllController)

// endpoint para agregar producto en un carrito -- solos user, usa combinacion de servicios
router.post('/:cid/product/:pid', cartAddProductController )

// endpoint para eliminar todos los productos del carrito -- emptyCart
router.delete('/:cid', cartDeleteProductsController )

//eliminar del carrito el producto indicado x id -- deleteProduct, usa combinacion de otros
router.delete('/:cid/product/:pid', cartDeleteProductByIDController )

//endpoint para agregar por body la cantidad a un producto en un carrito -- updateProductQty, no va, usa cpmbinacion
router.put('/:cid/product/:pid', cartUpdateProductQtyController)

// endpint para agregar producto/qty por body -- addProducts
router.put( '/:cid', cartAddProductsController )

// endpoint de preview de la compra de los prods q estan en el carrito
router.get('/:cid/purchase_preview', handlePolicies(['user']), cartPurchasePreviewController )


// endpoint para hacer la compra de los prods q estan en el carrito
router.get('/:cid/purchase', handlePolicies(['user']), cartPurchaseController )




export default router