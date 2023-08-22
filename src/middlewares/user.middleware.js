export const authController = (req, res, next) => {
    if (req.session?.user && req.session.user.profile == 'admin') {
        return next()
    }
    res.redirect ("http://localhost:8080/login")
}

export const auth2Controller = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
}
