import mongoose from "mongoose"
import config from "../config/config.js"


const userCollection = config.userCollection
const cartCollection = config.cartCollection

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    lastname: { type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true},
    profile: {type: String, enum: ['user', 'admin', 'premium'],required: true },
    lastlogin: {type: Date, default: Date.now},
    cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: cartCollection
            }
})

mongoose.set('strictQuery', false)
const userModel = mongoose.model(userCollection, userSchema)

export default userModel