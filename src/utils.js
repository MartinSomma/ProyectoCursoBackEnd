import bcrypt from 'bcrypt'
import {fileURLToPath} from 'url'
import { dirname } from 'path'
import { fakerES as faker } from '@faker-js/faker'
import nodemailer from 'nodemailer'
import config from './config/config.js'

const fromEmail = config.email
const emailPassword = config.emailPassword

faker.location = 'es'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const generateProducts = () => {
    
    return {
        //id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.commerce.price()),
        code: genRandonCode(8),
        status: faker.datatype.boolean(),
        stock: parseInt(faker.string.numeric()),
        category: faker.commerce.department(),
        thumbnails: [faker.image.url()]
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
 
export const sendEmail = async (dest, asunto, mensaje) => {
    try {
        let config = {
            service: 'gmail',
            auth: {
                user: fromEmail,
                pass: emailPassword
                
            }
        }

        let transporter = nodemailer.createTransport(config)

        let message = {
            from: fromEmail,
            to: dest,
            subject: asunto,
            html: mensaje
        }
    
        const result = await transporter.sendMail(message)
        return {status: 'success'}
    }
    catch (err){
        return err
    }

    //transporter.sendMail(message)
    //    .then(() => { return('success')} )
    //    .catch(err => { return err } )
}