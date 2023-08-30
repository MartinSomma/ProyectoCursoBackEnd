import cartModel from '../models/cart.model.js'

export default class CartDAO {
    getAll = async() => await cartModel.find().populate('products.product').lean().exec()
    getById = async(id) => await cartModel.findById(id).populate('products.product').lean().exec()
    getByIdSP = async(id) => await cartModel.findById(id).lean().exec()
    create = async() => {
        try{
            const prod = [{}]
            const result = await cartModel.create(prod)
            return result[0]._id
        } catch (err) {
            console.log (err)
        }
    }
    update = async (cid, data) => await cartModel.findByIdAndUpdate(cid, data, {returnDocument: 'after'})
}