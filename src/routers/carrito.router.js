import {Router} from 'express'
import Carrito from '../cart.js'
import cartModel from '../dao/models/cart.model.js'
import productModel from '../dao/models/products.model.js'

const router = Router()

export const getCarrito = async (req,res) => {

    try{

        const id = req.params.cid
        const resultado = await cartModel.findById(id).populate('products.product').lean().exec()

        if (resultado == null) {
            return res.status(404).json({status: 'error', error: 'not found'})
        }
        return resultado
    }
    catch (err) {
        return err
    }
    
}

router.post('/', async(req, res) => {
    
try{
    const prod = [{}]
    const result = await cartModel.create(prod)
    res.status(200).json({status: 'success', payload: result[0]._id})

} 
catch (err) {
    res.status(404).json({status: 'error', error: err.message})
}
    

})

// endpoint para ver todos los carritos -- NO PEDIDO, SOLO POR COMODIDAD --

router.get('/', async(req,res)=>{
    
    try{
        const resultado = await cartModel.find().populate('products.product').lean().exec()
        if (resultado == null) {
            return res.status(404).json({status: 'error', error: 'not found'})
        }
        res.status(200).json({status: 'success', payload: resultado})
    }
    catch (err) {
        res.status(404).json({status: 'error', error: err.message})
    }
    
})


// endpoint para ver carrito x ID
router.get('/:cid', async(req,res)=>{
    
    try{
        const result = await getCarrito(req, res)
        
        if (result == null) {
            return res.status(404).json({status: 'error', error: 'not found'})
        }
        res.status(200).json({status: 'success', payload: result})
    }
    catch (err) {
        res.status(404).json({status: 'error', error: err.message})
    }
    
})





router.post('/:cid/product/:pid', async(req,res) =>{
    const cid = req.params.cid
    const pid = req.params.pid
    try {
        

        const cart2Update = await cartModel.findById(cid)
        const newProd = await productModel.findById(pid)

        if (cart2Update == null) {
            return res.status(404).json({status: 'error', error: `El carrito con id ${cid} no existe`})
        }

        if (newProd == null) {
            return res.status(404).json({status: 'error', error: `El producto con id ${pid} no existe`})
        }
        
        const pIndex = cart2Update.products.findIndex( item => item.product == pid)

        if (pIndex > -1) {
            cart2Update.products[pIndex].quantity+=1
        }
        else {
            cart2Update.products.push({product: pid, quantity: 1})
        }
        
        const result = await cartModel.findByIdAndUpdate(cid, cart2Update, {returnDocument: 'after'})
        res.status(200).json({status: 'success', payload: result})

    }
    catch (err){
        res.status(404).json({status: 'error', error: err.message})

    }
    
})
//eliminar todos los productos del carrito
router.delete('/:cid', async(req,res) =>{
    try{
        const cid = req.params.cid
        const cart2Update = await cartModel.findById(cid)
        console.log (cart2Update)

        if (cart2Update == null) {
            return res.status(404).json({status: 'error', error: `El carrito con id ${cid} no existe`})
        }

        cart2Update.products = []
        const result = await cartModel.findByIdAndUpdate(cid, cart2Update, {returnDocument: 'after'})
        res.status(200).json({status: 'success', payload: result})

    }
    catch (err) {
        res.status(404).json({status: 'error', error: err.message})
    }
})

//eliminar del carrito el producto indicado x id
router.delete('/:cid/product/:pid', async(req, res) =>{
    
    try{
        const cid = req.params.cid
        const pid = req.params.pid

        const cart2Update = await cartModel.findById(cid).lean().exec()
        if (cart2Update == null) {
            return res.status(404).json({status: 'error', error: `El carrito con id ${cid} no existe`})
        }

        cart2Update.products = cart2Update.products.filter( item => item.product != pid )
        const result = await cartModel.findByIdAndUpdate(cid, cart2Update, {returnDocument: 'after'})
        res.status(200).json({status: 'success', payload: result})
    }
    catch (err){
        res.status(404).json({status: 'errorrrr', error: err.message})
    }
})

//endpoint para agregar por body la cantidad a un producto en un carrito
router.put('/:cid/product/:pid', async (req, res) => {
    
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cart2Update = await cartModel.findById(cid).lean().exec()
        const qty = req.body.qty

        if (!qty) {
            return res.status(400).json({error: 'error', error: 'falta campo qty'})
        }
        if (typeof(qty) != 'number'){
            return res.status(400).json({error: 'error', error: 'qty tiene que se numerico'})
        }
        if (qty == 0){
            return res.status(400).json({error: 'error', error: 'qty tiene q ser mayor a 0'})
        }

        const pIndex = cart2Update.products.findIndex(item => item.product == pid)
        if (pIndex == -1){
            return res.status(400).json({error: 'error', error: 'no esta el producto en el carrito'})
        }
        else {
            cart2Update.products[pIndex].quantity = qty
        }

        const resultado = await cartModel.findByIdAndUpdate(cid, cart2Update, {returnDocument: 'after'})
        res.status(200).json({status: 'success', payload: resultado})

    }
    catch (err) {
        res.status(404).json({status: 'errorrrr', error: err.message})

    }
    
})



router.put( '/:cid', async (req, res) => {

    try {
        const cid = req.params.cid
        const cart2Update = await cartModel.findById(cid)
        const products = req.body.products
        
        if (!products){
            return res.status(400).json({error: 'error', error: 'se debe esprcificar prodcuts'})

        }
        for (let i = 0; i < products.length; i++) {
            
            if ( !products[i].hasOwnProperty('product') || !products[i].hasOwnProperty('quantity') ){
                return res.status(400).json({error: 'error', error: 'debe tener product y quantity'})
            }
            if ( typeof products[i].quantity !== "number") {
                return res.status(400).json({error: 'error', error: 'quantity tiene q ser numerico'})
            }
            if ( products[i].quantity === 0 ){
                return res.status(400).json({error: 'error', error: 'quantity tiene q ser mayor a 0'})
            }

            const prod2add = await productModel.findById(products[i].product)
            if (prod2add == null){
                return res.status(400).json({error: 'error', error: `el producto ${products[i].product} no existe`})
            }
        }

        cart2Update.products= products
        const resultado = await cartModel.findByIdAndUpdate(cid, cart2Update, {returnDocument: 'after'})
        res.status(200).json({status: 'success', payload: resultado})


    }
    catch(err){
        res.status(404).json({status: 'errorrrr', error: err.message})

    }
})




export default router