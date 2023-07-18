import {Router} from 'express'
import { getCarrito } from './carrito.router.js'


const router = Router()

router.get('/:cid', async(req, res) => {
    try {

        const result = await getCarrito (req, res)
        console.log(result.products[0].product.code)
        res.status(200).render('carrito', {result})
        //res.status(200).json({ status: 'success', payload: result })

    }
    catch (err){
        return res.status(500).json({status: 'error', error: err.message})
    }
    

})


export default router