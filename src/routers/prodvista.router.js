import {Router} from 'express'
import { getProducts } from './products.router.js';


const router = Router()

const auth = (req, res, next) => {
    if (req.session?.user && req.session.user.profile == 'admin') {
        return next()
    }
    res.redirect ("http://localhost:8080/login")
}

const auth2 = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
}


router.get('/', auth2, async (req, res) => {

   try{
        
        const data = await getProducts (req, res)
        
        res.status(200).render('index', {
            data: data,
            username: req.session.passport.user.username,
            rol: req.session.passport.user.profile
        })
    }
    catch (err) {
        res.status(404).json({status:'error', error: err.message})
    }
    
})


export default router
