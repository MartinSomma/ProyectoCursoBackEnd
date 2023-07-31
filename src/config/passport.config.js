import passport from "passport"
import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy

const initializePassport = () => {


    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.0a2147906c016a6e',
        clientSecret: 'fd466531658ed77e72ceca8fe34342bf569b7dbb',
        callbackURL: 'http://localhost:8080/user/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        //console.log(profile)
        try {
            const user = await userModel.findOne({ username: profile._json.email })
            if (user) return done(null, user)
            const newUser = await userModel.create({
                username: profile._json.email,
                password: " ",
                profile : "user"

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
                console.log('User already exists')
                return done(null, false)
            }

            const newUser = {
                username, password: createHash(password), profile
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