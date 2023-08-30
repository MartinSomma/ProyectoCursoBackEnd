import productModel from "../models/products.model.js";
import config from '../config/config.js'

const PORT = config.port

export default class ProductDAO {
    getAll = async() => await productModel.find().lean().exec()
    getAllPaginate = async(req) => {

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
    getById = async(id) => await productModel.findById(id).lean().exec()
    create = async(data) => await productModel.create(data)
    update = async(id, data) => await productModel.findByIdAndUpdate(id, data, {returnDocument: 'after'})
    delete = async(id) => await productModel.findByIdAndDelete(id)
}