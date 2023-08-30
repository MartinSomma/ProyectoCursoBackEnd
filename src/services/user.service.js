import { User } from '../dao/user.factory.dao.js'
import UserRepository from '../repositories/user.repository.js'

export const UserService = new UserRepository (new User)