import { Cart } from '../dao/cart.factory.dao.js'
import CartRepository from '../repositories/cart.repository.js'

export const CartService = new CartRepository (new Cart)
