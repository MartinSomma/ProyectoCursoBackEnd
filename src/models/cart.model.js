import mongoose from "mongoose"
import config from "../config/config.js"

const cartCollection = config.cartCollection
const productCollection = config.productCollection

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: productCollection
            },
            quantity: Number
        }],
        default: []
    }
})

mongoose.set('strictQuery', false)
const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel