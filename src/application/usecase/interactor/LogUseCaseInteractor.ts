import { LogUseCase } from '@/application/usecase/log'

export class LogUseCaseInteractor implements LogUseCase {
  error = (e: Error): void => {
    console.error(e)
  }
}
