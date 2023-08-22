import mongoose from "mongoose"
import config from "../../config.js"


const userCollection = config.userCollection
const cartCollection = config.cartCollection

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true},
    profile: {type: String, enum: ['user', 'admin'],required: true },
    cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: cartCollection
            }
})

mongoose.set('strictQuery', false)
const userModel = mongoose.model(userCollection, userSchema)

export default userModel