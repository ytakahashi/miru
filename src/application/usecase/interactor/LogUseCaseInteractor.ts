import { LogUseCase } from '@/application/usecase/log'

const logger = window.preloadApi.initLogger()

export class LogUseCaseInteractor implements LogUseCase {
  error = (e: Error): void => {
    logger.error(e)
  }

  info = (message: string): void => {
    logger.info(message)
  }

  verbose = (message: string): void => {
    logger.verbose(message)
  }
}
