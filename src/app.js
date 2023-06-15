import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import realtimeproductsRouter from './routers/realtimeproducts.router.js'
import prodRouter from './routers/products.router.js'
import carritoRouter from './routers/carrito.router.js'
import prodVistaRouter from './routers/prodvista.router.js'
import ProductManager from './entregable2.js'



const app = express()
const httpServer = app.listen(8080, () => console.log('Srv Up!'))
const io = new Server(httpServer)
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')
app.use(express.static('./src/public'))

app.use((req,res,next) => {
    req.io = io
    next()
})

app.get('/health', (req, res) => res.json({ message: 'The server is running on port 8080' }))
app.use('/api/products', prodRouter)
app.use('/api/carrito', carritoRouter)
app.use('/products', prodVistaRouter)

app.use('/realtimeproducts', realtimeproductsRouter )

const messages = [1, 1, 1]

const manager = new ProductManager('./products.json');

io.on('connection', socket => {
    manager.getProducts().then(data =>{
        //console.log(data)
        io.emit('info', data)
    })
    //io.emit('info', messages)

})