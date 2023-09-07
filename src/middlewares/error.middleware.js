import EErrors from "../services/errors/enum.js";
import config from '../config/config.js'

const logging = config.logging

export default(error, req, res, next) => {
    //console.log('entro al mdw error')
    
    if (logging === "on") console.log (error.cause)
    switch(error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.name })
            break
        case EErrors.NOT_FOUND:
            res.status(404).send({ status: 'error', error: error.name })
            break
        default:
            res.send({ status: 'error', error: 'Unhandled error' })
            break
    }
}

