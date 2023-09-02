import log from 'electron-log'
import { LogUseCase } from '../../application/usecase/log'

log.transports.console.level = false
log.transports.file.level = process.env.npm_lifecycle_event === 'electron:dev' ? 'verbose' : 'info'

class Logger implements LogUseCase {
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

export const logger = new Logger()
logger.verbose(`log level: ${log.transports.file.level}`)
