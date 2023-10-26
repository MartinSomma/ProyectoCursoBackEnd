import passport from "passport"
import local from 'passport-local'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import config from "./config.js"
import { CartService } from "../services/cart.services.js"
import { UserService} from  "../services/user.service.js"


const githubClientID = config.githubClientID
const githubClientSecret = config.githubClientSecret
const githubCallBackURL = config.githubCallBackURL

const LocalStrategy = local.Strategy

const initializePassport = () => {


    passport.use('github', new GitHubStrategy({
        clientID: githubClientID,
        clientSecret: githubClientSecret,
        callbackURL: githubCallBackURL
    }, async(accessToken, refreshToken, profile, done) => {

        try {
            const user = await UserService.findOne({ email: profile._json.email })

            if (user) {
                const result = await UserService.update(user._id, {lastlogin: Date.now()})
                return done(null, user)
            }
            
            
            const cart = await CartService.create()
    
            const newUser = await UserService.create({
                name: profile._json.name,
                lastname: "github",
                email: profile._json.email,
                password: " ",
                profile : "user",
                cart: cart
            })

            return done(null, newUser)
        } catch(err) {
            return done(`Error to login with GitHub => ${err.message}`)
        }
    }))

    passport.use('registro', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, user, password, done) => {
        
        const { name, lastname, email, profile } = req.body
        
        
                
        try {
            const queryUser = await UserService.findOne({ email: email })
            
            if (queryUser) {
                return done(null, false)
            }

            const cart = await CartService.create()
            
            const newUser = {
                name, lastname, email, password: createHash(password), profile, cart
            }

            const result = await UserService.create(newUser)


            return done(null, result)
        } catch(err) {
            return done('error al obtener el user')
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(email, password, done) => {
                
        try {
            const queryUser = await UserService.findOne({ email: email })

            if (!queryUser ) {
                return done(null, false)
            }

            if (!isValidPassword(queryUser, password)) return done(null, false)

            const result = await UserService.update(queryUser._id, {lastlogin: Date.now()})
            return done(null, queryUser)
        } catch(err) {
            console.log(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserService.findById(id)
        done(null, user)
    })

}

export default initializePassport