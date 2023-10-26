import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import realtimeproductsRouter from './routers/realtimeproducts.router.js'
import prodRouter from './routers/products.router.js'
import carritoRouter from './routers/carrito.router.js'
import prodVistaRouter from './routers/prodvista.router.js'
import carritoVista from './routers/carritoVista.router.js'
import mongoose, { mongo } from 'mongoose'
import productModel from './models/products.model.js'
import registroVista from './routers/registroVista.router.js'
import loginVista from './routers/loginVista.router.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import userRouter from './routers/user.router.js'
import mockingproducts from './routers/mockingproducts.router.js'
import loggerRouter from './routers/logger.router.js'
import errorHandler from './middlewares/error.middleware.js'
import usersVista from './routers/vistaUsers.router.js'
import resetPasswordVista from './routers/resetPasswordVista.router.js'

import __dirname from "./utils.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js";

import config from './config/config.js'
import logger from './logger.js'
import { addlogger } from './middlewares/logger.middleware.js'

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion de API de Ecommerce CoderHouse',
            description: 'Proyecto Curso Backend'
        }   
    },
    apis: ['./docs/**/*.yaml']
}

const specs = swaggerJSDoc(swaggerOptions)




const PORT = config.port
const dbURL = config.dbURL
const dbName = config.dbNAME
const SessionSecretKey = config.SessionSecretKey

const app = express()
let io = new Server()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(addlogger)
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))



try {
    await mongoose.connect(dbURL, {
        useUnifiedTopology: true,
    })
    const httpServer = app.listen(PORT, () => logger.info('Srv Up!'))
    io = new Server(httpServer)
} catch(err) {
    logger.error(err.message)
}

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static( __dirname +'/public'))

app.use((req,res,next) => {
    req.io = io
    next()
})


app.use(session({
    store: MongoStore.create({
        mongoUrl: dbURL,
        dbName: dbName,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: SessionSecretKey,
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())



app.get('/health', (req, res) => res.json({ message: `The server is running on port ${PORT}` }))

app.use('/loggerTest', loggerRouter)


app.use('/api/products', prodRouter)
app.use('/api/carrito', carritoRouter)
app.use('/api/users', userRouter)

app.use('/products', prodVistaRouter)
app.use('/realtimeproducts', realtimeproductsRouter )
app.use('/carrito', carritoVista)
app.use('/registro', registroVista)
app.use('/login', loginVista)
app.use('/mockingproducts', mockingproducts)
app.use('/users', usersVista)
app.use('/reset-password', resetPasswordVista)

app.use(errorHandler)

io.on('connection', socket => {
    productModel.find()
    .then(data =>{
        io.emit('info', data)
    })
    //io.emit('info', messages)

})