import bcrypt from 'bcrypt'
import {fileURLToPath} from 'url'
import { dirname } from 'path'
import { fakerES as faker } from '@faker-js/faker'

faker.location = 'es'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const generateProducts = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.airline.flightNumber(),
        status: faker.datatype.boolean(),
        stock: faker.string.numeric(),
        category: faker.commerce.department(),
        thumbnails: faker.image.url(),
    }
}

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const genRandonCode = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charLength = chars.length;
    let result = '';
    for ( var i = 0; i < length; i++ ) {
       result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
 }
 