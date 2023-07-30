import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import realtimeproductsRouter from './routers/realtimeproducts.router.js'
import prodRouter from './routers/products.router.js'
import carritoRouter from './routers/carrito.router.js'
import prodVistaRouter from './routers/prodvista.router.js'
import ProductManager from './dao/fsManagers/entregable2.js'
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




const dbURL = 'mongodb+srv://martinps:p4ssw0rd@cluster0.v2lwqah.mongodb.net/ecommerce'

export const PORT = 8080
const app = express()
//const httpServer = app.listen(8080, () => console.log('Srv Up!'))
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
        dbName: 'ecommerce',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: 'victoriasecret',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())



app.get('/health', (req, res) => res.json({ message: 'The server is running on port 8080' }))
app.use('/api/products', prodRouter)
app.use('/api/carrito', carritoRouter)

//app.use('/user/registro', registro )
//app.use('/user/login', login)

app.use('/user', userRouter)


app.use('/products', prodVistaRouter)
app.use('/realtimeproducts', realtimeproductsRouter )
app.use('/carrito', carritoVista)
app.use('/registro', registroVista)
app.use('/login', loginVista)



const manager = new ProductManager('./products.json');

io.on('connection', socket => {


    productModel.find()
    .then(data =>{
        //console.log(data)
        io.emit('info', data)
    })
    //io.emit('info', messages)

})