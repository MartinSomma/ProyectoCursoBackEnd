import {Router} from 'express'
import ProductManager from '../entregable2.js'


const prueba = [2,3,4]

const manager = new ProductManager('./products.json');
const router = Router()

router.get('/', (request,response) => {
    
    const limit = request.query.limit
    const id = request.params.pid
    
    manager.getProducts().then((data) => {
        if (!limit && !id) {
            response.status(200).send(data) 
        } else if (id) {
            const prod = data.find(item => item.id == id)
            if (!prod) return response.status(404).send({ error: 'El producto no existe' })
            response.send(prod)
        } else if (limit) {
            response.send ( data.slice(0, limit) )
        } 
    } )
    
})

router.get('/:pid', (req,res) => {
    const id = req.params.pid
    manager.getProductById(id)
    .then( (data) => {
        if (data) return res.status(200).send(data)
        return res.status(404).send(`el producto con id ${id} no existe.`)
    })
} ) 

//endpoint para crear nuevo producto
router.post('/', async (req,res) => {
    //console.log("entramos aca")
    const {title, description, price, thumbnail, code, stock,status,category} = req.body
    const result = await manager.addProduct(title, description, price, thumbnail, code, stock,status,category)
    console.log('el resultado de la operacion es: ', result)

    if (typeof result == 'string') return res.json({status: 'error', error: result})
    
    const prods = await manager.getProducts()
    req.io.emit('info', prods)
    res.json({status: 'success', payload: result})
    
})

//endpoint para actualizar los datos de un usuario
router.put('/:pid', async(req,res) => {
    const id = req.params.pid
    const data = req.body

    if (await manager.updateProduct(id, data)){
        res.status(200).json({message: `El pid = ${id} se ha actualizado`})
    } else {
        res.status(404).json({message: 'error'})

    }
    const prods = await manager.getProducts()
    req.io.emit('info', prods)
    
})

router.delete('/:pid', async(req,res) => {
    const id = req.params.pid
    
    const resultado = await manager.deleteProductoByID(id)
    const prods = await manager.getProducts()
    req.io.emit('info', prods)
    
    if (resultado) res.json({status: 'success', payload: `ID ${id} fue eliminado`})
    else res.json ({status: 'error', error: `ID ${id} no encontrado`})
})


router.get('vista', (req, res) => {
    res.render('index')
})

export default router
