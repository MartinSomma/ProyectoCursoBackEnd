import {Router} from 'express'
import userModel from '../dao/models/user.model.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import express from 'express'

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


router.post("/registro", async (req, res) => {
  try {
    const data = req.body;
    if (data.username && data.password && data.profile) {
      let result = await userModel.find({ username: data.username });
      if (result.length == 1) {
        return res
          .status(404)
          .json({
            status: "error",
            message: `Usuario ${data.username} ya existe`,
          });
      }

      result = await userModel.create(data);
      return res
        .status(200)
        .json({
          status: "succes",
          payload: `Usuario ${result.username} dado de alta`,
        });
    } else {
      return res
        .status(500)
        .json({ status: "error", message: "hubo un error en el alta" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = req.body;
    const result = await userModel.find({
      username: user.username,
      password: user.password,
    });

    if (result.length == 1) {
      req.session.user = {username: result[0].username, profile: result[0].profile }

      if (req.session.user.profile == "admin") {
        res.redirect("http://localhost:8080/products");
      } else {
        res.send("es necesario ser admin");
      }
    } else {
      res.send("error de login");
    }
  } catch (err) {
    console.log(err);
  }
});


router.get("/logout", (req, res) => {
    
    req.session.destroy(err => {
        if (err) return res.json({ status: 'error', message: 'Ocurrio un error' })
        return res.json({ status: 'success', message: 'Cookie deleteada!' })
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