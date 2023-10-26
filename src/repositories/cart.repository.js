export default class CartRepository {
    constructor (dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAll()
    getById = async(id) => await this.dao.getById(id)
    getByIdSP = async(id) => await this.dao.getByIdSP(id)
    create = async() => await this.dao.create()
    update = async(id, data) => this.dao.update(id, data)
    deleteOne = async (data) => this.dao.deleteOne(data)
}