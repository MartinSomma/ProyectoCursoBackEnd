import { CartService, validarCarritoVenta } from '../services/cart.services.js'
import { ProdcutService } from '../services/product.service.js'
import { TicketService } from '../services/ticket.service.js'
import { genRandonCode } from '../utils.js'


export const cartPurchasePreviewController = async(req, res) => {
    const cartID = req.params.cid
    try{
      const products = await validarCarritoVenta(cartID)
      res.status(200).render("ticket_preview", { products });
    } catch(err) {
      console.log(err)
    }
  }

export const cartPurchaseController = async(req, res) => {

    const cartID = req.params.cid
    const cartPopulated = await CartService.getById(cartID)
    const products = await validarCarritoVenta(cartID)

    //Preparo el ticket, con total de la compra y productos.
    const data = {
        code: genRandonCode(12),
        total_amount: products.total_amount,
        purchaser: req.session.passport?.user.username || null,
        products: products.Ok.products
    }

    //genero el ticket con productos y actualizo carrito con productos sin stock 
    try{
        if (products.Ok.products.length == 0) {
            return res.send("No hay productos en el carrito o no hay stock")
        }

        //actualizo stock
        products.Ok.products.forEach(async (item) => await ProdcutService.update(item.product._id, {stock: item.product.stock-item.quantity}  ))

        const ticket = await TicketService.create(data)
        const ticketRender = await TicketService.findById(ticket._id)

        const cartResult = await CartService.update(cartID, products.NoOk )
        
        //res.status(200).json({status: "success", payload: cartResult})
        res.status(200).render("ticket", { ticketRender, products });
        
    } catch (err) {
        console.log(err)
    }
}

export const cartByIDController = async(req,res)=>{
    
    try{
        const id = req.params.cid
        const result = await CartService.getById(id)

        if (result == null) {
            return res.status(404).json({status: 'error', error: 'not found'})
        }
        res.status(200).json({status: 'success', payload: result})
    }
    catch (err) {
        res.status(404).json({status: 'error', error: err.message})
    }
    
}

export const cartCreateController = async(req, res) => {    
    try{
        const result = await CartService.create()
        res.status(200).json({status: 'success', payload: result})
    } 
    catch (err) {
        res.status(404).json({status: 'error', error: err.message})
    }
        
    
    }

export const cartViewAllController = async(req,res)=>{
    
        try{
            const resultado = await CartService.getAll()
            if (resultado == null) {
                return res.status(404).json({status: 'error', error: 'not found'})
            }
            res.status(200).json({status: 'success', payload: resultado})
        }
        catch (err) {
            res.status(404).json({status: 'error', error: err.message})
        }
        
    }

export const cartAddProductController = async(req,res) =>{
        const cid = req.params.cid
        const pid = req.params.pid
        try {
            
            const cart2Update = await CartService.getByIdSP(cid)
            
            const newProd = await ProdcutService.getById(pid)
    
            if (cart2Update == null) {
                return res.status(404).json({status: 'error', error: `El carrito con id ${cid} no existe`})
            }
    
            if (newProd == null) {
                return res.status(404).json({status: 'error', error: `El producto con id ${pid} no existe`})
            }
            
            const pIndex = cart2Update.products.findIndex( item => item.product == pid)
    
            if (pIndex > -1) {

                if (cart2Update.products[pIndex].quantity < newProd.stock){
                    cart2Update.products[pIndex].quantity+=1
                } else{
                    return res.status(404).json({status: 'error', error: `No se puede agregar, stock insuficiente`})
                }
                    
            }
            else {
                cart2Update.products.push({product: pid, quantity: 1})
            }

            const result = await CartService.update(cid, cart2Update)
            res.status(200).json({status: 'success', payload: result})
    
        }
        catch (err){
            res.status(404).json({status: 'error', error: err.message})
    
        }
        
}

export const cartDeleteProductsController = async(req,res) =>{
    try{
        const cid = req.params.cid
        const cart2Update = await CartService.getByIdSP(cid)
        
        if (cart2Update == null) return res.status(400).json({status: 'error', payload: `El carrito con id ${cid} no existe`})    

        cart2Update.products = []

        const result = await CartService.update(cid, cart2Update)
        res.status(200).json({status: 'success', payload: result})

    }
    catch (err) {
        res.status(404).json({status: 'error', error: err.message})
    }
}

export const cartDeleteProductByIDController = async(req, res) =>{  
    try{
        console.log('ahora estamos aca')
        const cid = req.params.cid
        const pid = req.params.pid

        const cart2Update = await CartService.getByIdSP(cid)
        
        if (cart2Update == null) {
            return res.status(404).json({status: 'error', error: `El carrito con id ${cid} no existe`})
        }

        cart2Update.products = cart2Update.products.filter( item => item.product != pid )
        
        const result = await CartService.update(cid, cart2Update)
        res.status(200).json({status: 'success', payload: result})
    }
    catch (err){
        res.status(404).json({status: 'error', error: err.message})
    }
}

export const cartUpdateProductQtyController = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cart2Update = await CartService.getByIdSP(cid)
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

        const resultado = await CartService.update(cid, cart2Update)
        res.status(200).json({status: 'success', payload: resultado})

    }
    catch (err) {
        res.status(404).json({status: 'errorrrr', error: err.message})

    }
    
}

export const cartAddProductsController = async (req, res) => {
    try {
        const cid = req.params.cid
        const cart2Update = await CartService.getByIdSP(cid)
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

            const prod2add = await ProdcutService.getById(products[i].product)
        
            if (prod2add == null){
                return res.status(400).json({error: 'error', error: `el producto ${products[i].product} no existe`})
            }

            if (products[i].quantity > prod2add.stock){
                return res.status(400).json({error: 'error', error: `Stock insuficiente. Prod ${products[i].product}, qty: ${products[i].quantity}, stock: ${prod2add.stock}`})
            }
        }

        cart2Update.products = [...products]
        
        const resultado = await CartService.update(cid, cart2Update)
        res.status(200).json({status: 'success', payload: resultado})


    }
    catch(err){
        res.status(404).json({status: 'errorrrr', error: err.message})

    }
}
