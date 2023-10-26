import { PasswordRecovery } from '../dao/passwordRecovery.factory.js'
import PasswordRecoveryRepository from '../repositories/passwordRecovery.repository.js'

export const PasswordRecoveryService = new PasswordRecoveryRepository (new PasswordRecovery)