export default class UserRepository {
    constructor (dao) {
        this.dao = dao
    }
    findOne = async(data) => await this.dao.findOne(data)
    findById = async(id) => await this.dao.findById(id)
    create = async(data) => await this.dao.create(data)
}