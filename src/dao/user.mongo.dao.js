import userModel from "../models/user.model.js";

export default class UserDAO {
    findOne = async(data) => await userModel.findOne(data).lean().exec()
    findById = async (id) => await userModel.findById(id)
    create = async (data) => await userModel.create(data)
    update = async (id, data) => await userModel.findByIdAndUpdate(id, data, {returnDocument: 'after'})
    updateOne = async (filter, update) => await userModel.findOneAndUpdate(filter, update ,{returnDocument: 'after'}).lean().exec()
    find = async(queryParams, fields) => await userModel.find(queryParams).select(fields).lean().exec()
    deleteOne = async(data) => await userModel.deleteOne(data)
    
}