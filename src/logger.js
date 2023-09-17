import winston from "winston";
import config from "./config/config.js";


const env = config.ENVIROMENT

const customLeveloptions ={
    levels: {
        debug: 5,
        http: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0,
    },
    colors:{
        fatal: 'red',
        error: 'cyan',
        warning: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'white'
    }
}

const createLogger = (env) => {

    if (env == 'PROD') {
        return winston.createLogger({
            levels: customLeveloptions.levels,
            transports: [
                new winston.transports.File({
                    filename: './logs/errors.log',
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.simple(),
                    )
                })
            ]
        })
    } else {
        return winston.createLogger({
            levels: customLeveloptions.levels,
            transports: [
                new winston.transports.Console({ 
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize({ colors: customLeveloptions.colors }),
                        winston.format.simple(),
                    )
                })
            ]
        })
    }
}

const logger = createLogger(env)

export default logger