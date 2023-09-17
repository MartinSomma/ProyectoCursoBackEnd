import logger from "../logger.js"

export const addlogger = (req, res, next) =>{
    //req.logger = logger
    logger.http(`${req.method} en ${req.url}`)
    next()
}