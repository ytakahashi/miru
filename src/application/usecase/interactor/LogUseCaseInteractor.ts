import { LogUseCase } from '@/application/usecase/log'

export class LogUseCaseInteractor implements LogUseCase {
  error = (e: Error): void => {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}
