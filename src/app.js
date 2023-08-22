import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import realtimeproductsRouter from './routers/realtimeproducts.router.js'
import prodRouter from './routers/products.router.js'
import carritoRouter from './routers/carrito.router.js'
import prodVistaRouter from './routers/prodvista.router.js'
import carritoVista from './routers/carritoVista.router.js'
import mongoose, { mongo } from 'mongoose'
import productModel from './dao/models/products.model.js'
import registroVista from './routers/registroVista.router.js'
import loginVista from './routers/loginVista.router.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import userRouter from './routers/user.router.js'

import __dirname from "./utils.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js";

import config from './config.js'

const PORT = config.port
const dbURL = config.dbURL
const dbName = config.dbNAME
const SessionSecretKey = config.SessionSecretKey

const app = express()
let io = new Server()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


try {
    await mongoose.connect(dbURL, {
        useUnifiedTopology: true,
    })
    const httpServer = app.listen(PORT, () => console.log('Srv Up!'))
    io = new Server(httpServer)
} catch(err) {
    console.log(err.message)
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
app.use('/api/products', prodRouter)
app.use('/api/carrito', carritoRouter)

app.use('/user', userRouter)

app.use('/products', prodVistaRouter)
app.use('/realtimeproducts', realtimeproductsRouter )
app.use('/carrito', carritoVista)
app.use('/registro', registroVista)
app.use('/login', loginVista)

io.on('connection', socket => {
    productModel.find()
    .then(data =>{
        io.emit('info', data)
    })
    //io.emit('info', messages)

})