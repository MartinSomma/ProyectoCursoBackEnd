export default class PasswordRecoveryRepository {
    constructor (dao) {
        this.dao = dao
    }
    findOne = async(data) => await this.dao.findOne(data)
    findById = async(id) => await this.dao.findById(id)
    create = async(data) => await this.dao.create(data)
    update = async(id, data) => await this.dao.update(id, data)
    updateOne = async(filter, update) => await this.dao.updateOne(filter, update)
    find = async(queryParams, fields)=> await this.dao.find(queryParams, fields)
    deleteOne = async(data) => await this.dao.deleteOne(data)
}