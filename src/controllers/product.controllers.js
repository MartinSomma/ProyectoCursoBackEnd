import productModel from '../dao/models/products.model.js'
import {getProductsService} from '../services/product.services.js'

export const getProductsController = async(req,res) => {
    try{
        const result = await getProductsService(req, res)
        res.status(200).json({ status: 'success', payload: result })
    }
    catch (err){
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const getProductByIDController = async (req,res) => {
    
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
}

export const createProductController = async (req,res) => {
    
    try {
        const prod = req.body
        const result = await productModel.create(prod)

        req.io.emit('info', await productModel.find().lean().exec())
        res.status(201).json({ status: 'success', payload: result })
        
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
    
}

export const updateProductController = async(req,res) => { 
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
        
}

export const deleteProductByIdController = async(req,res) => {
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
    
}