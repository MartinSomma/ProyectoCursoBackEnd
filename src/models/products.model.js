import mongoose from "mongoose"
import mongoosePaginte from 'mongoose-paginate-v2'
import config from "../config/config.js"

const productCollection = config.productCollection

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true},
    price: {type: Number, required: true },
    code: {type: String, unique: true, required: true},
    status:{ type: Boolean, default: true },
    stock: { type: Number, required: true},
    category: { type: String, required: true},
    thumbnails: { type: [String], default: []}
})

mongoose.set('strictQuery', false)
productsSchema.plugin(mongoosePaginte)
const productModel = mongoose.model(productCollection, productsSchema)

export default productModel