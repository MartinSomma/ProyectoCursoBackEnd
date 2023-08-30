import config from '../config/config.js'

export let User

switch (config.persistance) {
    case 'MONGO':
        const { default: UserDAO } = await import ('../dao/user.mongo.dao.js')
        User = UserDAO
        break
    case 'FILE':
        const { default: UserFileDAO } = await import ('../dao/user.file.js')
        User = UserFileDAO
        break
    default:
        break
}