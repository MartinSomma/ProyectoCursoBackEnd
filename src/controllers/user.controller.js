export const registroController = (req, res) => {
    res.redirect('/login')
}

export const failRegisterController = (req, res) =>{
    res.send({ error: 'Error al registrar!'})
}

export const loginController = (req, res) => {
    res.redirect('/products')  
}

export const failLoginController = (req, res) => {
    res.send({ error: 'Login Fail!'})
}

export const githubController = async(req, res) => {
 
}

export const githubcallbackController = (req, res) => {
    res.redirect('/products')
}

export const logoutController = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.json({ status: 'error', message: 'Ocurrio un error' })
        return res.redirect('/login')
    })
}

export const queryController = (req,res) => {
    if (req.session.passport?.user.username) {
        res.send(`el usuario logueado es ${req.session.passport.user.username}`)
    } else {
        res.send(`no hay usuario logueado`)
    }  
}