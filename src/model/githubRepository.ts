export class RepositoryUrl {
  readonly #urlRegex = /^https:\/\/(?<origin>[^/]+)\/(?<owner>[^/]+)\/(?<name>.+)$/
  readonly #url: string;
  readonly #owner?: string;
  readonly #repositoryName?: string;

  constructor (url: string) {
    this.#url = url
    const result = url.match(this.#urlRegex)
    if (result?.groups !== undefined) {
      this.#owner = result.groups.owner
      this.#repositoryName = result.groups.name
    }
  }

  public isValid = (): boolean => {
    return this.#repositoryName !== undefined && this.#owner !== undefined
  }

  public getUrl = (): string => {
    return this.#url
  }

  public getOwner = (): string => {
    if (this.#owner === undefined) {
      throw new Error('Invalid URL')
    }
    return this.#owner
  }

  public getRepositoryName = (): string => {
    if (this.#repositoryName === undefined) {
      throw new Error('Invalid URL')
    }
    return this.#repositoryName
  }

  public asString = (): string => {
    return `${this.#owner}/${this.#repositoryName}`
  }
}
