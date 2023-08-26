import passport from "passport"
import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import config from "../config.js"
import { cartCreateService } from "../services/cart.services.js"

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
            const user = await userModel.findOne({ username: profile._json.email })
            if (user) return done(null, user)
            const cart = await cartCreateService()
            const newUser = await userModel.create({
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
            const queryUser = await userModel.findOne({ username: user }).lean().exec()
            if (queryUser) {
                return done(null, false)
            }

            const cart = await cartCreateService()
            const newUser = {
                username, password: createHash(password), profile, cart
            }
            const result = await userModel.create(newUser)
            return done(null, result)
        } catch(err) {
            return done('error al obtener el user')
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'username'
    }, async(user, password, done) => {
        try {
            const queryUser = await userModel.findOne({ username: user }).lean().exec()
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
        const user = await userModel.findById(id)
        //console.log('des',user)
        done(null, user)
    })

}

export default initializePassport