
import passwordRecoveryModel from '../models/passwordrecovery.model.js'

export default class PasswordRecoveryDAO {
    findOne = async(data) => await passwordRecoveryModel.findOne(data).lean().exec()
    findById = async (id) => await passwordRecoveryModel.findById(id)
    create = async (data) => await passwordRecoveryModel.create(data)
    update = async (id, data) => await passwordRecoveryModel.findByIdAndUpdate(id, data, {returnDocument: 'after'})
    updateOne = async (filter, update) => await passwordRecoveryModel.findOneAndUpdate(filter, update ,{returnDocument: 'after'}).lean().exec()
    find = async(queryParams, fields) => await passwordRecoveryModel.find(queryParams).select(fields).lean().exec()
    deleteOne = async(data) => await passwordRecoveryModel.deleteOne(data)
    
}