import log from 'electron-log/main.js'
import { Logger } from '../../application/domain/interface/logger.js'

log.transports.console.level = false
log.transports.file.level = process.env.npm_lifecycle_event === 'electron:dev' ? 'verbose' : 'info'

class LoggerImpl implements Logger {
  error = (e: Error): void => {
    log.error(e)
  }

  info = (message: string): void => {
    log.info(message)
  }

  verbose = (message: string): void => {
    log.verbose(message)
  }
}

export const logger = new LoggerImpl()
logger.verbose(`log level: ${log.transports.file.level}`)
