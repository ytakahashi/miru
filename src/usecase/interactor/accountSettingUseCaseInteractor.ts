import { unlinkSync } from 'fs'
import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { Account, GitHubUrl } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { GitHubAccount } from '@/infrastructure/dto/local'
import { AccountSettingUseCase } from '@/usecase/accountSetting'

export class AccountSettingUseCaseInteractor implements AccountSettingUseCase {
  #localStorageAccessor: LocalStorageAccessor

  constructor (localStorageAccessor: LocalStorageAccessor) {
    this.#localStorageAccessor = localStorageAccessor
  }

  addRepositoryUrl = (url: RepositoryUrl): void => {
    const current = this.#localStorageAccessor.getGitHubRepositoryUrls()
    const next = current.length ? new Set([...current, url.getUrl()]) : new Set([url.getUrl()])
    this.#localStorageAccessor.setGitHubRepositoryUrls(Array.from(next))
  }

  deleteRepositoryUrl = (url: RepositoryUrl): void => {
    const current = this.#localStorageAccessor.getGitHubRepositoryUrls()
    const next = current.filter(r => r !== url.getUrl())
    this.#localStorageAccessor.setGitHubRepositoryUrls(Array.from(next))
  }

  getRepositoryUrls = (): Array<RepositoryUrl> => {
    const urls = this.#localStorageAccessor.getGitHubRepositoryUrls()
    return urls.map(v => new RepositoryUrl(v))
  }

  clearRepositoryUrls = (): void => {
    this.#localStorageAccessor.deleteGitHubRepositoryUrls()
  }

  setAccount = (account: Account): void => {
    const gitHubAccount: GitHubAccount = {
      userName: account.userName,
      profileUrl: account.profileUrl,
      avatarUrl: account.avatarUrl,
      githubUrl: account.githubUrl.getUrl(),
      githubApiEndpoint: account.githubUrl.getApiEndpoint(),
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

  deleteSetting = (): void => {
    const path = this.#localStorageAccessor.getPath()
    try {
      unlinkSync(path)
    } catch (err) {
      console.error('delete failed. ', err)
    }
  }
}
