import UserDTO from "../dto/user.dto.js"
import { UserService} from  "../services/user.service.js"
import { createHash, genRandonCode, sendEmail } from "../utils.js"
import logger from "../logger.js"
import { CartService } from "../services/cart.services.js"
import { PasswordRecoveryService } from "../services/passwordRecovery.service.js"


export const newPasswordController = async(req, res) =>{
    try{

        const {user, password, token} = req.body

        const userCheck = await UserService.findOne({email: user})
        const tokenCheck = await PasswordRecoveryService.findOne({token: token})

        if (!userCheck)
            return res.satus(400).json({status: 'error', message: 'no existe el usuario'})
        if (!tokenCheck || (tokenCheck.isUsed == true) )
            return res.status(400).json({status: 'error', message: 'token invalido'})

        const filter ={email: user}
        const update = {password: createHash(password)}
        const resultado = await UserService.updateOne(filter, update)
        
        await PasswordRecoveryService.updateOne({token: token, email: user}, {isUsed: true})

        res.status(200).json({status:'success', message: 'Contraseña actualizada'})   
    }
    catch(err){
        logger.error(err)
    }
}

export const verifyTokenController = async(req, res) =>{
    
    try{
        const token = req.params.token
    
        const resultado = await PasswordRecoveryService.findOne({token: token, isUsed: false})

        if( !resultado )
            return res.status(400).json({status: 'error', message: 'Token expirado o invalido'})
        const user = {email: resultado.email, token: token}
        res.render('new-password', {user})

        //res.status(200).json({status: 'success', message: 'Token verificado'})
    }
    catch (err){
        res.status(400).json({status: 'error', message: err})
    }
}

export const passwordRecoveryController = async(req,res) => {
    try {
        const user = req.body.email

        const checkUser = await UserService.findOne({email: user})
        if (!checkUser)
            return res.status(400).json({status: 'error', message: 'no existe el usuario'})

        const data = {email: user, token: genRandonCode(20)}
        const resultado = await PasswordRecoveryService.create(data)

        if (resultado == null)
            throw new Error('no se pudo crear token de recuperacion de contraseña')
            
        sendEmail(user, 'Recuperacion de contraseña', `Para recuperar la contraseña <a href="http://localhost:8080/api/users/recovery/${data.token}">aqui</a>  `)
        res.status(200).json({status:'success', payload:'token de recuperacion creado'})
        
    }
    catch (err){
        logger.error(err)
        res.status(400).json({status: 'error', message: err})
    }
    

    
}

export const updateUserController = async(req, res)=> {
    const data = req.body
    const id = req.params.id

    const resultado = await UserService.update(id, data)
    
    res.status(200).json({ status: 'success', payload: resultado })
    
}
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
    
    if (req.session.passport?.user.email) {
        const info = new UserDTO(req.session.passport.user).info
        res.send(info)
    } else {
        res.send(`no hay usuario logueado`)
    }  
}

export const queryAllUsersController = async(req, res) =>{
    
    const fields = {name: 1, lastname: 1, email: 1, profile: 1, _id: 0}
    const params = {}
    const result = await UserService.find(params, fields)
    res.send(result)

}

export const deleteExpiredUsers = async (req, res) => {
    
    const fields = {}
    
    // Calcula la fecha actual menos 2 dias, borra "user" los q tienen mas de 5 mins sin actividad
    const dosDiasAtras = new Date();
    dosDiasAtras.setDate(dosDiasAtras.getDate() - 2);

    const queryParams = { profile: 'user', lastlogin: { $lt: dosDiasAtras } }
    const usersInactive = await UserService.find(queryParams, fields)

    for (const user of usersInactive) {
        try {
            const userBorrado = await UserService.deleteOne({ _id: user._id })
            const cartBorrado = await CartService.deleteOne({ _id: user.cart})
            
            userBorrado.deletedCount == 1 ? (logger.info(`usuario ${user.email} borrado`)) : logger.error(`Hubo un problema, usuario ${user.email} borrado`)
            cartBorrado.deletedCount == 1 ? (logger.info(`carrito ${user.cart} borrado`)) : logger.error(`carrito ${user.cart} borrado`)
        
            const resultado = await sendEmail(`${user.email}` , 
                                        'Ecommerce - Notificacion de usuario expirado',
                                        `<h1>El usuario ${user.email} ha sido eliminado por inactividad</h1>` )
            
        } 
        catch (err){
            logger.error(err)
        }
    }    
    res.status(200).json({status: 'proceso ejecutado'})
    }

