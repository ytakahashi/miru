import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { newLocalStorageAccessor } from '@/domain/interface/factory'
import { Account, GitHubUrl } from '@/model/github'
import { GitHubAccount } from '@/model/dto/local'

export class AccountSettingService {
  #localStorageAccessor: LocalStorageAccessor

  constructor (configPostfix: string) {
    this.#localStorageAccessor = newLocalStorageAccessor(configPostfix)
  }

  setRepositoryUrls = (urls: Array<string>): void => {
    const current = this.#localStorageAccessor.getGitHubRepositoryUrls()
    const next = current.length ? new Set([...current, ...urls]) : new Set(urls)
    this.#localStorageAccessor.setGitHubRepositoryUrls(Array.from(next))
  }

  getRepositoryUrls = (): Array<string> => {
    return this.#localStorageAccessor.getGitHubRepositoryUrls()
  }

  clearRepositoryUrls = (): void => {
    this.#localStorageAccessor.deleteGitHubRepositoryUrls()
  }

  setAccount = (account: Account): void => {
    const gitHubAccount: GitHubAccount = {
      userName: account.userName,
      profileUrl: account.profileUrl,
      avatarUrl: account.avatarUrl,
      githubUrl: account.githubUrl.url,
      githubApiEndpoint: account.githubUrl.apiEndpoint,
      personalAccessToken: account.personalAccessToken
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
}
