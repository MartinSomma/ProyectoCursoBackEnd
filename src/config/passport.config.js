import passport from "passport"
import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('registro', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'username'
    }, async(req, username, password, done) => {
        const { user_name, profile } = req.body
        console.log("pasa")
        try {
            const user = await userModel.findOne({ username: user_name })
            if (user) {
                console.log('User already exists')
                return done(null, false)
            }

            const newUser = {
                user_name, password: createHash(password), profile
            }
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch(err) {
            return done('error al obtener el user')
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username })
            if (!user ) {
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch(err) {

        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport