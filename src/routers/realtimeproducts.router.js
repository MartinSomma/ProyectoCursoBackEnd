import { Router } from  'express'

const router = Router()

const objPrueba = {id:1, title: "Vista de Productos online con webockets"}

router.get('/', (req,res)=>{
    res.render('realtimeproducts', objPrueba)
})

export default router