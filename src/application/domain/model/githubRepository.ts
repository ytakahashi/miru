const urlRegex = /^https:\/\/(?<origin>[^/]+)\/(?<owner>[^/]+)\/(?<name>[^/]+)\/?$/

type Preference = {
  showsCommits: boolean
  showsIssues: boolean
  showsPullRequests: boolean
  showsReleases: boolean
}
export class RepositorySetting {
  readonly #origin?: string
  readonly #owner?: string
  readonly #repositoryName?: string
  #preference: Preference = {
    showsCommits: true,
    showsIssues: true,
    showsPullRequests: true,
    showsReleases: true,
  }

  constructor(url: string, preference?: Preference) {
    const result = url.match(urlRegex)
    if (result?.groups !== undefined) {
      this.#origin = result.groups.origin
      this.#owner = result.groups.owner
      this.#repositoryName = result.groups.name
      if (preference !== undefined) {
        this.#preference = preference
      }
    }
  }

  public isValid = (): boolean => {
    return (
      this.#origin !== undefined && this.#repositoryName !== undefined && this.#owner !== undefined
    )
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

  public displayName = (separator = '/'): string => {
    return `${this.#owner}${separator}${this.#repositoryName}`
  }

  public setCommitPreference = (b: boolean): void => {
    this.#preference.showsCommits = b
  }

  public setIssuePreference = (b: boolean): void => {
    this.#preference.showsIssues = b
  }

  public setPullRequestPreference = (b: boolean): void => {
    this.#preference.showsPullRequests = b
  }

  public setReleasePreference = (b: boolean): void => {
    this.#preference.showsReleases = b
  }

  public showsCommits = (): boolean => {
    return this.#preference.showsCommits
  }

  public showsIssues = (): boolean => {
    return this.#preference.showsIssues
  }

  public showsPullRequests = (): boolean => {
    return this.#preference.showsPullRequests
  }

  public showsReleases = (): boolean => {
    return this.#preference.showsReleases
  }

  public equals = (other: RepositorySetting): boolean => {
    return this.getUrl() === other.getUrl()
  }
}
