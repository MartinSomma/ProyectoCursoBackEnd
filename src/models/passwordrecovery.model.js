import mongoose from "mongoose"
import config from "../config/config.js"

const passwordRecoveryCollection = config.passwordRecoveryCollection

const passwordRecoverySchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true},
    isUsed: { type: Boolean, default: false},
}, {timestamps: true})

passwordRecoverySchema.index({createdAt: 1}, {expireAfterSeconds: 3600})


mongoose.set('strictQuery', false)
const passwordRecoveryModel = mongoose.model(passwordRecoveryCollection, passwordRecoverySchema, passwordRecoveryCollection)

export default passwordRecoveryModel