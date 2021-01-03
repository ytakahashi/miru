const githubApiEndpoint = 'https://api.github.com/graphql'

export class GitHubUrl {
  #url: string;
  #apiEndpoint: string;

  constructor (url: string) {
    this.#url = url
    // TODO: initialize/validation
    this.#apiEndpoint = githubApiEndpoint
  }

  get url (): string {
    return this.#url
  }

  get apiEndpoint (): string {
    return this.#apiEndpoint
  }
}
