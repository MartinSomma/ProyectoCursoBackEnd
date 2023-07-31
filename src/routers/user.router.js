import {Router} from 'express'
import userModel from '../dao/models/user.model.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import express from 'express'
import passport from "passport";
import { createHash, isValidPassword } from '../utils.js'

const router = Router()
const dbURL = 'mongodb+srv://martinps:p4ssw0rd@cluster0.v2lwqah.mongodb.net/ecommerce'

const app = express()


app.use(session({
    store: MongoStore.create({
        mongoUrl: dbURL,
        dbName: 'ecommerce',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: 'victoriasecret',
    resave: true,
    saveUninitialized: true
}))

 //API para crear usuarios en la DB con passport

 router.post('/registro', passport.authenticate('registro', {
  failureRedirect: '/user/failRegister'
}), async(req, res) => {
  res.redirect('/login')
})

router.get('/failRegister', (req, res) => {
  res.send({ error: 'Error al registrar!'})
})

//API para crear usuarios en la DB "a mano"
//router.post("/registro", async (req, res) => {
  
  //try {
  //  
  //  if (req.body.username && req.body.password && req.body.profile) {
//
  //    const data = {
  //      username: req.body.username,
  //      password: createHash(req.body.password),
  //      profile: req.body.profile
  //    }
//
  //    let result = await userModel.find({ username: data.username });
  //    
  //    if (result.length == 1) {
  //      return res.status(404).json({ status: "error", message: `Usuario ${data.username} ya existe`});
  //    }
//
  //    result = await userModel.create(data);
  //    return res.status(200).json({ status: "succes", payload: `Usuario ${result.username} dado de alta`});
  //  
  //  } else {
  //    return res.status(500).json({ status: "error", message: "Faltan datos para la creacion del usuario" });
  //  }
  //} catch (err) {
  //  res.status(500).json({ status: "error", message: err });
  //}
//});

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



// API de login "manual"
//router.post("/login", async (req, res) => {
//  try {
//    const {username, password} = req.body;
//    const result = await userModel.findOne({ username }).lean().exec();
//
//    //console.log(result)
//
//    if (!result){
//      return res.status(401).send("Usuario no encontrado");
//    }
//
//    if( !isValidPassword(result, password)) {
//      return res.status(403).send({status: 'error', error: 'Password incorrecta' })
//    }
//
//    req.session.user = result
//    
//    if (req.session.user.profile == "admin") {
//      res.redirect("/products");
//    } else {
//      res.send("es necesario ser admin");
//    }
//
//
//  } catch (err) {
//    console.log(err);
//  }
//});


router.get("/logout", (req, res) => {
    
    req.session.destroy(err => {
        if (err) return res.json({ status: 'error', message: 'Ocurrio un error' })
        //return res.json({ status: 'success', message: 'Cookie deleteada!' })
        return res.redirect('/login')
    })
})

router.get('/query',(req,res)=>{
    
    if (req.session.user?.username) {
        res.send(`el usuario logueado es ${req.session.user.username}`)
    } else {
        res.send(`no hay usuario logueado`)
    }
    
} )

export default router