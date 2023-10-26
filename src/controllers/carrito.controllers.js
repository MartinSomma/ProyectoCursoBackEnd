import { CartService, validarCarritoVenta } from '../services/cart.services.js'
import { ProdcutService } from '../services/product.service.js'
import { TicketService } from '../services/ticket.service.js'
import { genRandonCode, sendEmail } from '../utils.js'
import CustomError from "../services/errors/customError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo, generateDataErrorInfo } from "../services/errors/info.js";
import logger from '../logger.js'
import { UserService } from '../services/user.service.js';


export const cartPurchasePreviewController = async(req, res, next) => {
    const cartID = req.params.cid
    try{
        const products = await validarCarritoVenta(cartID)

        if (products == null) {
            CustomError.createError({
                name: 'CartId not found',
                cause: generateDataErrorInfo(cartID),
                message: 'Error looking for cartID in DB',
                code: EErrors.NOT_FOUND
            })
        }

        res.status(200).render("ticket_preview", { products });

    } catch(err) {
        next(err)
    }
  }

export const cartPurchaseController = async(req, res, next) => {

    const cartID = req.params.cid

    try {
        const products = await validarCarritoVenta(cartID)

        if (products == null) {
            CustomError.createError({
                name: 'CartId not found',
                cause: generateDataErrorInfo(cartID),
                message: 'Error looking for cartID in DB',
                code: EErrors.NOT_FOUND
            })
        }

        //Preparo el ticket, con total de la compra y productos.
        const data = {
            code: genRandonCode(12),
            total_amount: products.total_amount,
            purchaser: req.session.passport?.user.username || null,
            products: products.Ok.products
        }

        //genero el ticket con productos y actualizo carrito con productos sin stock 
        
        if (products.Ok.products.length == 0) {
            return res.send("No hay productos en el carrito o no hay stock")
        }

        //actualizo stock
        products.Ok.products.forEach(async (item) => await ProdcutService.update(item.product._id, {stock: item.product.stock-item.quantity}  ))

        const ticket = await TicketService.create(data)
        const ticketRender = await TicketService.findById(ticket._id)
        const cartResult = await CartService.update(cartID, products.NoOk )

        console.log(ticketRender)
        console.log(products)
        
        res.status(200).render("ticket", { ticketRender, products });
        
    } catch (err) {
        next(err)
    }
}

export const cartByIDController = async(req,res,next)=>{
    
    try{
        const id = req.params.cid
        const result = await CartService.getById(id)

        if (result == null) {
            CustomError.createError({
                name: `CartId ${id} not found`,
                cause: generateDataErrorInfo(id),
                message: `Error looking for cartID in DB`,
                code: EErrors.NOT_FOUND
            })
            
        }
        res.status(200).json({status: 'success', payload: result})
    }
    catch (err) {
        next(err)
    }
    
}

export const cartCreateController = async(req, res) => {    
    try{
        const result = await CartService.create()
        res.status(200).json({status: 'success', payload: result})
    } 
    catch (err) {
        logger.error(err)
        res.status(404).json({status: 'error', error: err.message})
    }
        
    
    }

export const cartViewAllController = async(req,res,next)=>{
    
        try{
            const resultado = await CartService.getAll()
            if (resultado == null) {
                CustomError.createError({
                    name: 'Carts not found',
                    cause: generateDataErrorInfo(id),
                    message: 'Error looking for carts (all IDs) in DB',
                    code: EErrors.NOT_FOUND
                })
            }
            res.status(200).json({status: 'success', payload: resultado})
        }
        catch (err) {
            next(err)
        }
        
    }

export const cartAddProductController = async(req,res,next) =>{
        const cid = req.params.cid
        const pid = req.params.pid
        try {
            
            const cart2Update = await CartService.getByIdSP(cid)
            
            const newProd = await ProdcutService.getById(pid)
    
            if (cart2Update == null) {
                CustomError.createError({
                    name: 'CartId not found',
                    cause: generateDataErrorInfo(cid),
                    message: `El carrito con id ${cid} no existe`,
                    code: EErrors.NOT_FOUND
                })
            }
    
            if (newProd == null) {
                CustomError.createError({
                    name: 'Products ID not found',
                    cause: generateDataErrorInfo(pid),
                    message: `El producto con id ${pid} no existe`,
                    code: EErrors.NOT_FOUND
                })
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
            next(err)
    
        }
        
}

export const cartDeleteProductsController = async(req,res, next) =>{
    try{
        const cid = req.params.cid
        const cart2Update = await CartService.getByIdSP(cid)
        
        if (cart2Update == null) {
            CustomError.createError({
                name: `CartId ${cid} not found`,
                cause: generateDataErrorInfo(cid),
                message: `Error looking for cartID in DB`,
                code: EErrors.NOT_FOUND
            })
        }
        

        cart2Update.products = []

        const result = await CartService.update(cid, cart2Update)
        res.status(200).json({status: 'success', payload: result})

    }
    catch (err) {
        next(err)
    }
}

export const cartDeleteProductByIDController = async(req, res) =>{  
    try{
        const cid = req.params.cid
        const pid = req.params.pid

        //Buscar user por cartid
        const params = {cart: cid}
        const user = await UserService.findOne(params)
        

        if (user.profile.toLowerCase() == 'premium') {
            const product = await ProdcutService.getById(pid)
            sendEmail(user.email, 'Producto Eliminado', `El producto ${product.title} fue eliminado por el administrador`)
            logger.info("Notif a user Premium de producto eliminado")
        }
        
        const cart2Update = await CartService.getByIdSP(cid)
        
        if (cart2Update == null) {
            return res.status(404).json({status: 'error', error: `El carrito con id ${cid} no existe`})
        }
        
        cart2Update.products = cart2Update.products.filter( item => item.product != pid )
        

        const result = await CartService.update(cid, cart2Update)
        res.status(200).json({status: 'success', payload: result})
    }
    catch (err){
        logger.error(err)
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
        logger.error(err)
        res.status(404).json({status: 'error', error: err.message})

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
        logger.error(err)
        res.status(404).json({status: 'error', error: err.message})

    }
}
