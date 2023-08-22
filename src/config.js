import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program
    .option('--mode <mode>', 'Modo de ejecución', 'development')
program.parse()

// console.log(program.opts().mode === 'development')

dotenv.config({
    path: program.opts().mode === 'development'
        ? './.env.dev'
        : './.env.prod'
})

export default {
    port: process.env.PORT,
    dbURL: process.env.dbURL,
    dbNAME: process.env.dbNAME,
    SessionSecretKey: process.env.SESSION_SECRET_KEY,
    userCollection: process.env.USER_COLLECTION,
    githubClientID: process.env.GITHUB_clientID,
    githubClientSecret: process.env.GITHUB_clientSecret,
    githubCallBackURL: process.env.GITHUB_callbackURL,
    productCollection: process.env.PRODUCT_COLLECTION,
    cartCollection: process.env.CART_COLLECTION
}