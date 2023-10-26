import {Router} from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import express from 'express'
import passport from "passport";
import config from '../config/config.js'
import { handlePolicies } from '../middlewares/policies.middleware.js'

import { registroController, failRegisterController, loginController,
        failLoginController, githubController, githubcallbackController, logoutController,
        queryController, queryAllUsersController, deleteExpiredUsers,
        updateUserController, passwordRecoveryController, verifyTokenController,
        newPasswordController } from '../controllers/user.controller.js';



const router = Router()
const dbURL = config.dbURL
const dbName = config.dbNAME
const secretSessionKey = config.SessionSecretKey

const app = express()

app.use(session({
    store: MongoStore.create({
        mongoUrl: dbURL,
        dbName: dbName,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: secretSessionKey,
    resave: true,
    saveUninitialized: true
}))

//API para consultar usuario
router.get('/', queryAllUsersController)

//API para ver/eliminar Usuarios expirados
router.get('/expired', deleteExpiredUsers)

 //API para crear usuarios en la DB con passport
router.post('/registro', passport.authenticate('registro', {failureRedirect: '/user/failRegister'}) , registroController)
router.get('/failRegister', failRegisterController )


//API de login con passport
router.post('/login', passport.authenticate('login', { failureRedirect: '/user/failLogin'}), loginController)
router.get('/failLogin', failLoginController)

//API de login con GITHUB
router.get('/github', passport.authenticate('github', { scope: ['user:email']}), githubController)
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), githubcallbackController)

//API de logout
router.get("/logout", logoutController)

//API para consultar usuario logueado  -- no pedido, solo por comodidad
router.get('/current', queryController)

//API para actulizar datos de un usuario
router.put('/:id', updateUserController )

//API para generar token de recuperacion de password
router.post('/passwordrecovery', passwordRecoveryController)

//API para recuperar password
router.get ('/recovery/:token', verifyTokenController )

// API para cambiar contraseña
router.post ('/new-password', newPasswordController)

export default router