export class ApplicationSetting {
  public readonly configPostfix: string

  constructor (configPostfix: string) {
    this.configPostfix = configPostfix
  }

  public equals = (other: ApplicationSetting): boolean => {
    return this.configPostfix === other.configPostfix
  }
}
