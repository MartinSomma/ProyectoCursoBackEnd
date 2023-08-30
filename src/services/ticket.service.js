
import TicketRepository from '../repositories/ticket.repository.js'
import TicketDAO from '../dao/ticket.mongo.dao.js'

export const TicketService = new TicketRepository (new TicketDAO)