import {Router} from 'express'
import ProductManager from '../dao/fsManagers/entregable2.js'
import productModel from '../dao/models/products.model.js'
import {PORT} from '../app.js'

const router = Router()

export const getProducts = async (req, res) => {
    try{
        
        const limit = req.query.limit || 10
        const page= req.query.page || 1
        
        const filterOptions = {}
        const paginateOptions = {lean: true, limit, page}

        if (req.query.category) filterOptions.category = req.query.category
        if (req.query.stock) filterOptions.stock = req.query.category
        
        if (req.query.sort === 'asc') paginateOptions.sort = {price: 1}
        if (req.query.sort === 'desc') paginateOptions.sort = {price: -1}
        

        const result = await productModel.paginate(filterOptions, paginateOptions)
        
        
        if (result.hasNextPage && req.query.page){
            const strUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
            result.nextLink = `http://${req.hostname}:${PORT}${strUrl}`
           
        } else if (result.hasNextPage && !req.query.page){
            result.nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}?page=${result.nextPage}`
        }
        else { 
            result.nextLink = null
        }

        if (result.hasPrevPage && req.query.page){
            const strUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
            result.prevLink = `http://${req.hostname}:${PORT}${strUrl}`
           
        } else if (result.hasPrevPage && !req.query.page){
            result.prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}?page=${result.nextPage}`
        }
        else { 
            result.prevLink = null
        }

        return result

    }
    catch (err) {
        
        return err
    }

}

router.get('/', async(req,res) => {
   
    try{
        const result = await getProducts(req, res)
        res.status(200).json({ status: 'success', payload: result })
    }
    catch (err){
        res.status(500).json({status: 'error', error: err.message})
    }
    
    

    
})

router.get('/:pid', async (req,res) => {
    
    try {
        const id = req.params.pid
        const prod = await productModel.findById(id).lean().exec()
        if (prod == null){
            return res.status(404).json({status: 'error', error: 'not found'})
        }
        res.status(200).json({status: 'success', payload: prod })

    }
    catch (err) {
        res.status(404).json({status: 'error', error: err.message  })
    }
}) 

//endpoint para crear nuevo producto
router.post('/', async (req,res) => {
    
    try {
        const prod = req.body
        const result = await productModel.create(prod)

        req.io.emit('info', await productModel.find().lean().exec())
        res.status(201).json({ status: 'success', payload: result })
        
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
    
})

//endpoint para actualizar los datos de un producto
router.put('/:pid', async(req,res) => {
    
    try {

        const id = req.params.pid
        const data = req.body

        const result = await productModel.findByIdAndUpdate(id, data, {returnDocument: 'after'})

        if (result=== null) {
            return res.send(404).json({ status: 'error', error: 'not found'  })
        }

        req.io.emit('info', await productModel.find().lean().exec())
        res.status(200).json({message: `El pid = ${id} se ha actualizado`})
    }
    catch (err) {
        res.status(500).json({status: 'error', message: err.message})
    }
        
})

router.delete('/:pid', async(req,res) => {
    

    try {
        const id = req.params.pid
        const resultado = await productModel.findByIdAndDelete(id)

        if ( resultado == null ){
            return res.status(404).json({status: 'error', error: `El pid = ${id} no existe`})
        }
        
        const prods = await productModel.find().lean().exec()
        req.io.emit('info', prods)
        res.status(200).json({status: 'success' , message: `El pid = ${id} se ha eliminado`})
        
    }
    catch (error) {
        res.status(404).json({status: 'error', error: error.message})
    }
    
})


//router.get('vista', (req, res) => {
//    res.render('index')
//})

export default router
