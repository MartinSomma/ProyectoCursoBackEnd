import cartModel from '../dao/models/cart.model.js'

export const getCarritoService = async (id) => {

    try{
        const resultado = await cartModel.findById(id).populate('products.product').lean().exec()

        if (resultado == null) {
            return null
        }
        return resultado
    }
    catch (err) {
        return err
    }
    
}


export const cartCreateService = async() => {   
    try{
        const prod = [{}]
        const result = await cartModel.create(prod)
        return result[0]._id
    } 
    catch (err) {
        return err
    }        
}
