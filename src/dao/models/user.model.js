import mongoose from "mongoose"


const userCollection = 'users'

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true},
    profile: {type: String, enum: ['user', 'admin'],required: true },
})

mongoose.set('strictQuery', false)
const userModel = mongoose.model(userCollection, userSchema)

export default userModel