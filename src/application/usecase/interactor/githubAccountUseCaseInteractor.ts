import { GitHubAccessor } from '@/application/domain/interface/githubAccessor.js'
import { Account, GitHubUrl } from '@/application/domain/model/github.js'
import { GitHubAccountUseCase } from '@/application/usecase/githubAccount.js'

export class GitHubAccountUseCaseInteractor implements GitHubAccountUseCase {
  #githubUrl: GitHubUrl
  #githubAccessor: GitHubAccessor

  constructor(githubUrl: GitHubUrl, githubAccessor: GitHubAccessor) {
    this.#githubUrl = githubUrl
    this.#githubAccessor = githubAccessor
  }

  resolvePersonalAccessToken = async (personalAccessToken: string): Promise<Account> => {
    const viewer = await this.#githubAccessor.getViewer(personalAccessToken)
    if (viewer === undefined) {
      throw new Error('unknown account')
    }
    return new Account(
      viewer.viewer.login,
      viewer.viewer.url,
      viewer.viewer.avatarUrl,
      new GitHubUrl(this.#githubUrl.getUrl(), this.#githubUrl.getApiEndpoint()),
      personalAccessToken
    )
  }
}
