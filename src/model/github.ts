const githubApiEndpoint = 'https://api.github.com/graphql'

export class GitHubUrl {
  #url: string;
  #apiEndpoint: string;

  constructor (url: string, apiEndpoint?: string) {
    this.#url = url
    // TODO: initialize/validation
    this.#apiEndpoint = apiEndpoint === undefined ? githubApiEndpoint : apiEndpoint
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
