const urlRegex = /^https:\/\/(?<origin>[^/]+)\/(?<owner>[^/]+)\/(?<name>[^/]+)\/?$/

export class RepositoryUrl {
  readonly #origin?: string;
  readonly #owner?: string;
  readonly #repositoryName?: string;

  constructor (url: string) {
    const result = url.match(urlRegex)
    if (result?.groups !== undefined) {
      this.#origin = result.groups.origin
      this.#owner = result.groups.owner
      this.#repositoryName = result.groups.name
    }
  }

  public isValid = (): boolean => {
    return this.#origin !== undefined && this.#repositoryName !== undefined && this.#owner !== undefined
  }

  public getUrl = (): string => {
    return `https://${this.#origin}/${this.#owner}/${this.#repositoryName}`
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
