import { newGitHubAccessor, newLocalStorageAccessor } from '@/domain/interface/factory'
import { GitHubUrl } from '@/model/github'
import { GitHubAccount } from '@/model/dto/local'

export class GitHubAccountService {
  #githubUrl: GitHubUrl

  constructor (githubUrl: GitHubUrl) {
    this.#githubUrl = githubUrl
  }

  resolvePersonalAccessToken = async (personalAccessToken: string): Promise<GitHubAccount|undefined> => {
    const githubAccessor = newGitHubAccessor(this.#githubUrl.apiEndpoint, personalAccessToken)
    const viewer = await githubAccessor.getViewer().catch(e => console.error(e))
    if (viewer === undefined) {
      return undefined
    }
    const account: GitHubAccount = {
      userName: viewer.viewer.login,
      profileUrl: viewer.viewer.url,
      avatarUrl: viewer.viewer.avatarUrl,
      githubUrl: this.#githubUrl.url,
      githubApiEndpoint: this.#githubUrl.apiEndpoint,
      personalAccessToken: personalAccessToken
    }

    const store = newLocalStorageAccessor(account.personalAccessToken)
    store.setGitHubAccount(account)
    return account
  }
}
