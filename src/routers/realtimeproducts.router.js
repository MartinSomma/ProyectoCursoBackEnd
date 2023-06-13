import { Router } from  'express'

const router = Router()

const objPrueba = {id:1, title: "prueba de titulo"}

router.get('/', (req,res)=>{
    res.render('realtimeproducts', objPrueba)
})

export default router