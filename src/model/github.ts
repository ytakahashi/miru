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
    if (apiEndpoint !== undefined) {
      return apiEndpoint
    }
    return `${url}/api/graphql`
  }

  get url (): string {
    return this.#url
  }

  get apiEndpoint (): string {
    return this.#apiEndpoint
  }

  getDomain = (): string => {
    // TODO
    return this.#url.substring(8)
  }

  isEnterprise = (): boolean => {
    return this.#url !== githubEndpoint
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

export class IssueLabel {
  public readonly name: string;
  public readonly color: string;
  constructor (name: string, color: string) {
    this.name = name
    this.color = color
  }
}

export class Issue {
  public readonly title: string;
  public readonly url: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly labels: Array<IssueLabel>;

  constructor (
    title: string,
    url: string,
    createdAt: string,
    updatedAt: string,
    labels: Array<IssueLabel>
  ) {
    this.title = title
    this.url = url
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.labels = labels
  }
}
