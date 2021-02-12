import log from 'electron-log'
import { LogUseCase } from '@/application/usecase/log'

const isProduction = process.env.NODE_ENV === 'production'
if (isProduction) {
  log.transports.console.level = false
  log.transports.file.level = 'warn'
}

export class LogUseCaseInteractor implements LogUseCase {
  error = (e: Error): void => {
    log.error(e)
  }
}
