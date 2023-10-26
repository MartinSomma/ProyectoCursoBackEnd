import { ProdcutService } from '../services/product.service.js' 
import config from '../config/config.js'
import CustomError from "../services/errors/customError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo, generateDataErrorInfo } from "../services/errors/info.js";
import logger from '../logger.js'

const PORT = config.port


export const getProductsController = async(req,res) => {
    try{
        const result = await ProdcutService.getAllPaginate(req, PORT)
        res.status(200).json({ status: 'success', payload: result })
    }
    catch (err){
        logger.error(err)
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const getProductByIDController = async (req,res,next) => {
    
    try {
        const id = req.params.pid
        const prod = await ProdcutService.getById(id)
        if (prod == null){
            CustomError.createError({
                name: 'Id not found',
                cause: generateDataErrorInfo(id),
                message: 'Error error looking for ID in DB',
                code: EErrors.NOT_FOUND
            })
        }
        res.status(200).json({status: 'success', payload: prod })

    }
    catch (err) {
        next(err)
    }
}

export const createProductController = async (req,res,next) => {
    
    try {
        const prod = req.body


        if (!prod.title || !prod.description || !prod.price || !prod.code || 
            !prod.stock || !prod.category){
                CustomError.createError({
                    name: 'Product creation error',
                    cause: generateProductErrorInfo(prod),
                    message: 'Error creating product propio',
                    code: EErrors.INVALID_TYPES_ERROR
                })
        }


        const result = await ProdcutService.create(prod)

        req.io.emit('info', await ProdcutService.getAll())
        res.status(201).json({ status: 'success', payload: result })
        
    } catch(err) {
        next(err)
    }
    
}

export const updateProductController = async(req,res, next ) => { 
    try {

        const id = req.params.pid
        const data = req.body
        const result = await ProdcutService.update(id, data)
        
        if (result === null) {
            CustomError.createError({
                name: 'Id not found',
                cause: generateDataErrorInfo(id),
                message: 'Error looking for ID in DB',
                code: EErrors.NOT_FOUND
            })
        }

        req.io.emit('info', await ProdcutService.getAll())
        res.status(200).json({message: `El pid = ${id} se ha actualizado`})
    }
    catch (err) {
        next(err)
    }
        
}

export const deleteProductByIdController = async(req, res, next) => {
    try {
        const id = req.params.pid

        const resultado = await ProdcutService.delete(id)
        if ( resultado == null ){
            CustomError.createError({
                name: 'Id not found',
                cause: generateDataErrorInfo(id),
                message: 'Error error looking for ID in DB',
                code: EErrors.NOT_FOUND
            })
        }
        
        const prods = await ProdcutService.getAll()
        req.io.emit('info', prods)
        res.status(200).json({status: 'success' , message: `El pid = ${id} se ha eliminado`})
        
    }
    catch (error) {
        next(error)
    }
    
}