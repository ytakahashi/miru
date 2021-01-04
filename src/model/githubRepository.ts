export class RepositoryUrl {
  private urlRegex = /^https:\/\/(?<origin>[^/]+)\/(?<owner>[^/]+)\/(?<name>.+)$/
  private readonly url: string;
  private readonly owner?: string;
  private readonly name?: string;

  constructor (url: string) {
    this.url = url
    const result = url.match(this.urlRegex)
    if (result?.groups !== undefined) {
      this.owner = result.groups.owner
      this.name = result.groups.name
    }
  }

  public isValid = (): boolean => {
    return this.name !== undefined && this.owner !== undefined
  }

  public getUrl = (): string => {
    return this.url
  }

  public getOwner = (): string => {
    if (this.owner === undefined) {
      throw new Error('Invalid URL')
    }
    return this.owner
  }

  public getName = (): string => {
    if (this.name === undefined) {
      throw new Error('Invalid URL')
    }
    return this.name
  }
}
