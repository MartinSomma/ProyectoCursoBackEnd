import {Router} from 'express'
import logger from '../logger.js'

const router = Router()

router.get('/', (req, res) => {
    logger.debug('logger debug')
    logger.http('logger http')
    logger.info('logger info')
    logger.warning('logger warning')
    logger.error('logger error')
    logger.fatal('logger fatal')
    
    res.json({ message: `logger funcionando` })
})

export default router