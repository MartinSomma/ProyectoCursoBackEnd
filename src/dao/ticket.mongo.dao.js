import ticketModel from "../models/ticket.model.js"

export default class TicketDAO {
    findById = async (id) => await ticketModel.findById(id).lean()
    create = async (data) => await ticketModel.create(data)
    
}