const githubEndpoint = 'https://github.com'
const githubApiEndpoint = 'https://api.github.com/graphql'

export class GitHubUrl {
  #url: string;
  #apiEndpoint: string;

  constructor (url?: string, apiEndpoint?: string) {
    // TODO: validation
    this.#url = this.initUrl(url)
    this.#apiEndpoint = this.initApiEndpoint(this.#url, apiEndpoint)
  }

  private initUrl (url?: string): string {
    return url === undefined ? githubEndpoint : url
  }

  private initApiEndpoint (url: string, apiEndpoint?: string): string {
    if (url === githubEndpoint) {
      return githubApiEndpoint
    }
    return `${url}/api/graphql`
  }

  get url (): string {
    return this.#url
  }

  get apiEndpoint (): string {
    return this.#apiEndpoint
  }
}

export class Account {
  public readonly userName: string;
  public readonly profileUrl: string;
  public readonly avatarUrl: string;
  public readonly githubUrl: GitHubUrl;
  public readonly personalAccessToken: string;

  constructor (
    userName: string,
    profileUrl: string,
    avatarUrl: string,
    githubUrl: GitHubUrl,
    personalAccessToken: string
  ) {
    this.userName = userName
    this.profileUrl = profileUrl
    this.avatarUrl = avatarUrl
    this.githubUrl = githubUrl
    this.personalAccessToken = personalAccessToken
  }
}
