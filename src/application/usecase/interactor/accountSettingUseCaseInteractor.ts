import { unlinkSync } from 'fs'
import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor'
import { Account, GitHubUrl } from '@/application/domain/model/github'
import { GitHubAccount } from '@/application/infrastructure/dto/local'
import { AccountSettingUseCase } from '@/application/usecase/accountSetting'
import { LogUseCase } from '@/application/usecase/log'

export class AccountSettingUseCaseInteractor implements AccountSettingUseCase {
  #localStorageAccessor: LocalStorageAccessor
  #logger: LogUseCase

  constructor(localStorageAccessor: LocalStorageAccessor, logger: LogUseCase) {
    this.#localStorageAccessor = localStorageAccessor
    this.#logger = logger
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
    const path = this.#localStorageAccessor.getPath()
    try {
      unlinkSync(path)
    } catch (err) {
      this.#logger.error(err as Error)
    }
  }
}
