import EErrors from "../services/errors/enum.js";
import config from '../config/config.js'
import logger from "../logger.js";

const logging = config.logging

export default(error, req, res, next) => {
    
    if (logging === "on") logger.error(error.cause)

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

