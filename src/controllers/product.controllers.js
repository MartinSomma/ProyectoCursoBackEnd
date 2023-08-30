import { ProdcutService } from '../services/product.service.js' 
import config from '../config/config.js'

const PORT = config.port


export const getProductsController = async(req,res) => {
    try{
        const result = await ProdcutService.getAllPaginate(req, PORT)
        res.status(200).json({ status: 'success', payload: result })
    }
    catch (err){
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const getProductByIDController = async (req,res) => {
    
    try {
        const id = req.params.pid
        const prod = await ProdcutService.getById(id)
        if (prod == null){
            return res.status(404).json({status: 'error', error: 'not found'})
        }
        res.status(200).json({status: 'success', payload: prod })

    }
    catch (err) {
        res.status(404).json({status: 'error', error: err.message  })
    }
}

export const createProductController = async (req,res) => {
    
    try {
        const prod = req.body
        const result = await ProdcutService.create(prod)

        req.io.emit('info', await ProdcutService.getAll())
        res.status(201).json({ status: 'success', payload: result })
        
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
    
}

export const updateProductController = async(req,res) => { 
    try {

        const id = req.params.pid
        const data = req.body

        //const result = await productModel.findByIdAndUpdate(id, data, {returnDocument: 'after'})
        const result = await ProdcutService.update(id, data)
        if (result=== null) {
            return res.send(404).json({ status: 'error', error: 'not found'  })
        }

        req.io.emit('info', await ProdcutService.getAll())
        res.status(200).json({message: `El pid = ${id} se ha actualizado`})
    }
    catch (err) {
        res.status(500).json({status: 'error', message: err.message})
    }
        
}

export const deleteProductByIdController = async(req,res) => {
    try {
        const id = req.params.pid
        //const resultado = await productModel.findByIdAndDelete(id)
        const resultado = await ProdcutService.delete(id)
        if ( resultado == null ){
            return res.status(404).json({status: 'error', error: `El pid = ${id} no existe`})
        }
        
        const prods = await ProdcutService.getAll()
        req.io.emit('info', prods)
        res.status(200).json({status: 'success' , message: `El pid = ${id} se ha eliminado`})
        
    }
    catch (error) {
        res.status(404).json({status: 'error', error: error.message})
    }
    
}