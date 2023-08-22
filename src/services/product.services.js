import productModel from '../dao/models/products.model.js'
import config from '../config.js'

const PORT = config.port

export const getProductsService = async (req, res) => {
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
