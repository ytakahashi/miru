import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor.js'
import { Account, GitHubUrl } from '@/application/domain/model/github.js'
import { GitHubAccount } from '@/application/infrastructure/dto/local.js'
import { AccountSettingUseCase } from '@/application/usecase/accountSetting.js'

export class AccountSettingUseCaseInteractor implements AccountSettingUseCase {
  #localStorageAccessor: LocalStorageAccessor

  constructor(localStorageAccessor: LocalStorageAccessor) {
    this.#localStorageAccessor = localStorageAccessor
  }

  setAccount = (account: Account): void => {
    const gitHubAccount: GitHubAccount = {
      userName: account.userName,
      profileUrl: account.profileUrl,
      avatarUrl: account.avatarUrl,
      githubUrl: account.githubUrl.getUrl(),
      githubApiEndpoint: account.githubUrl.getApiEndpoint(),
      personalAccessToken: account.personalAccessToken,
    }
    this.#localStorageAccessor.setGitHubAccount(gitHubAccount)
  }

  getAccount = (): Account => {
    const stored = this.#localStorageAccessor.getGitHubAccount()
    if (stored === undefined) {
      throw new Error('Account not stored')
    }
    return new Account(
      stored.userName,
      stored.profileUrl,
      stored.avatarUrl,
      new GitHubUrl(stored.githubUrl, stored.githubApiEndpoint),
      stored.personalAccessToken
    )
  }

  deleteSetting = (): void => {
    this.#localStorageAccessor.deleteSettings()
  }
}
