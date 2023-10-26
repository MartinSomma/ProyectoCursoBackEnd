import config from '../config/config.js'

export let PasswordRecovery

switch (config.persistance) {
    case 'MONGO':
        const { default: PasswordRecoveryDAO } = await import ('../dao/passwordRecovery.mongo.dao.js')
        PasswordRecovery = PasswordRecoveryDAO
        break
    case 'FILE':
        const { default: PasswordRecoveryFileDAO } = await import ('../dao/passwordrecovery.file.js')
        PasswordRecovery = PasswordRecoveryFileDAO
        break
    default:
        break
}