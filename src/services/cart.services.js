import { Cart } from '../dao/cart.factory.dao.js'
import CartRepository from '../repositories/cart.repository.js'

export const CartService = new CartRepository (new Cart)

export const validarCarritoVenta = async(id) =>{
    const cartPopulated = await CartService.getById(id)

    if (cartPopulated == null) return null

    const productos = {
        Ok: {
            products:[]
        },
        total_amount: 0,
        NoOk: {
            products:[]
        }
    }

    productos.Ok.products = cartPopulated.products.filter(item => item.quantity <= item.product.stock)    
    productos.NoOk.products = cartPopulated.products.filter(item => item.quantity > item.product.stock)

    productos.total_amount = productos.Ok.products.reduce((total, item) => total + item.product.price * item.quantity, 0)

    return productos
}
