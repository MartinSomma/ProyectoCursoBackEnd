import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program
    .option('--mode <mode>', 'Modo de ejecución', 'development')
program.parse()

dotenv.config({
    path: program.opts().mode === 'development'
        ? './.env.dev'
        : './.env.prod'
})

export default {
    ENVIROMENT: program.opts().mode,
    port: process.env.PORT,
    dbURL: process.env.dbURL,
    dbNAME: process.env.dbNAME,
    SessionSecretKey: process.env.SESSION_SECRET_KEY,
    githubClientID: process.env.GITHUB_clientID,
    githubClientSecret: process.env.GITHUB_clientSecret,
    githubCallBackURL: process.env.GITHUB_callbackURL,
    userCollection: process.env.USER_COLLECTION,
    productCollection: process.env.PRODUCT_COLLECTION,
    passwordRecoveryCollection: process.env.PASSWORD_RECOVERY_COLLECTION,
    cartCollection: process.env.CART_COLLECTION,
    ticketCollection: process.env.TICKET_COLLECTION,
    persistance: process.env.PERSISTANCE,
    logging: process.env.LOGGING,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAILPASSWORD
}