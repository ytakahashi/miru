import { newGitHubAccessor } from '@/domain/interface/factory'
import { Account, GitHubUrl } from '@/model/github'

export class GitHubAccountService {
  #githubUrl: GitHubUrl

  constructor (githubUrl: GitHubUrl) {
    this.#githubUrl = githubUrl
  }

  resolvePersonalAccessToken = async (personalAccessToken: string): Promise<Account> => {
    const githubAccessor = newGitHubAccessor(this.#githubUrl)
    const viewer = await githubAccessor.getViewer(personalAccessToken)
    if (viewer === undefined) {
      throw new Error('unknown account')
    }
    return new Account(
      viewer.viewer.login,
      viewer.viewer.url,
      viewer.viewer.avatarUrl,
      new GitHubUrl(this.#githubUrl.url, this.#githubUrl.apiEndpoint),
      personalAccessToken
    )
  }
}
