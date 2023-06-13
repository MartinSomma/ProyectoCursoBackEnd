import {Router} from 'express'
import Carrito from '../cart.js'

const carrito = new Carrito ('./carrito.json')
const router = Router()

router.post('/', async(req, res) => {
    res.status(200).send({id: `${await carrito.newCart()}`}) 
})

router.get('/:cid', async(req,res)=>{
    const id = req.params.cid
    const resultado = await carrito.getCartId(id)
    if (resultado) {
        res.status(200).send(await carrito.getCartId(id))
    } else {
        res.status(404).send({error: 404, message: `el carrito con id=${id} no existe`})
    }
    
})

router.post('/:cid/product/:pid', async(req,res) =>{
    const cid = req.params.cid
    const pid = req.params.pid
    console.log("estamos")
    const resultado = await carrito.addProduct2Cart( cid, pid )
    if (resultado) {
        res.status(200).send(resultado)
    } else {
        res.status(404).send('el carrito no existe')
    }
    
})


export default router