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
            const user = await UserService.findOne({ username: profile._json.email })
            if (user) return done(null, user)
            const cart = await CartService.create()
            const newUser = await UserService.create({
                username: profile._json.email,
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
        usernameField: 'username'
    }, async(req, user, password, done) => {
        const { username, profile } = req.body
                
        try {
            const queryUser = await UserService.findOne({ username: user })
            if (queryUser) {
                return done(null, false)
            }

            const cart = await CartService.create()

            const newUser = {
                username, password: createHash(password), profile, cart
            }
            const result = await UserService.create(newUser)
            return done(null, result)
        } catch(err) {
            return done('error al obtener el user')
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'username'
    }, async(user, password, done) => {
        try {
            const queryUser = await UserService.findOne({ username: user })
            if (!queryUser ) {
                return done(null, false)
            }

            if (!isValidPassword(queryUser, password)) return done(null, false)
            return done(null, queryUser)
        } catch(err) {
            console.log(err)
        }
    }))

    passport.serializeUser((user, done) => {
        //console.log('serialize', user)
        done(null, user)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserService.findById(id)
        //console.log('des',user)
        done(null, user)
    })

}

export default initializePassport