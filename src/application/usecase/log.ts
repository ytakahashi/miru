export interface LogUseCase {
  error(e: Error): void
  info(message: string): void
  verbose(message: string): void
}
