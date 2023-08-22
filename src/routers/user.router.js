import {Router} from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import express from 'express'
import passport from "passport";
import config from '../config.js'


const router = Router()
const dbURL = config.dbURL
const dbName = config.dbNAME
const secretSessionKey = config.SessionSecretKey

const app = express()

app.use(session({
    store: MongoStore.create({
        mongoUrl: dbURL,
        dbName: dbName,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: secretSessionKey,
    resave: true,
    saveUninitialized: true
}))

 //API para crear usuarios en la DB con passport
router.post('/registro', 
            passport.authenticate('registro', {failureRedirect: '/user/failRegister'}), 
            async(req, res) => {
                res.redirect('/login')
            })

router.get('/failRegister', (req, res) => {
    res.send({ error: 'Error al registrar!'})
  } )


//API de login con passport
router.post('/login', passport.authenticate('login', 
            { failureRedirect: '/user/failLogin'}), 
            async (req, res) => {
              res.redirect('/products')
})

router.get('/failLogin', (req, res) => {
  res.send({ error: 'Login Fail!'})
})


router.get('/github',
    passport.authenticate('github', { scope: ['user:email']}),
    async(req, res) => {}
)

router.get('/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/login'}),
    async(req, res) => {
        res.redirect('/products')
    }
)

router.get("/logout", (req, res) => {   
    req.session.destroy(err => {
        if (err) return res.json({ status: 'error', message: 'Ocurrio un error' })
        return res.redirect('/login')
    })
})

router.get('/query', (req,res)=>{
    if (req.session.passport?.user.username) {
        res.send(`el usuario logueado es ${req.session.passport.user.username}`)
    } else {
        res.send(`no hay usuario logueado`)
    }    
})

export default router