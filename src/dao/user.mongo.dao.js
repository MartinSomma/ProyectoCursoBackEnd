import userModel from "../models/user.model.js";

export default class UserDAO {
    findOne = async(data) => await userModel.findOne(data).lean().exec()
    findById = async (id) => await userModel.findById(id)
    create = async (data) => await userModel.create(data)
    
}