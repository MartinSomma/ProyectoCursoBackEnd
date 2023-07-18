import {Router} from 'express'
import ProductManager from '../dao/fsManagers/entregable2.js'
import productModel from '../dao/models/products.model.js'
import fetch from "node-fetch";
import { getProducts } from './products.router.js';

const router = Router()
const manager = new ProductManager('./products.json');

router.get('/', async (req, res) => {

   try{
        //const data = await productModel.find().lean().exec()
        const data = await getProducts (req, res)
        res.status(200).render('index', {data})
    }
    catch (err) {
        res.status(404).json({status:'error', error: err.message})
    }
    
})


export default router
