import mongoose from "mongoose"
import config from "../config/config.js"

const ticketCollection = config.ticketCollection

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true },
    total_amount: {type: Number, required: true },
    purchaser: { type: String, default: true },
    products: { type: [Object], default: []},
    purchase_datetime: { type: Date, required: true, default: Date.now}
})

mongoose.set('strictQuery', false)
const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel