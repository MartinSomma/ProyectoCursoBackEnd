export default class TicketRepository {
    constructor (dao) {
        this.dao = dao
    }
    findById = async(id) => await this.dao.findById(id)
    create = async(data) => await this.dao.create(data)
    }