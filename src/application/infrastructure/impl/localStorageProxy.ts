import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor'
import { ApplicationSetting } from '@/application/domain/model/application'
import { GitHubAccount, RepositorySetting } from '@/application/infrastructure/dto/local'

export class LocalStorageProxy implements LocalStorageAccessor {
  #localStorageAccessor: LocalStorageAccessor

  constructor(namePostfix?: string) {
    this.#localStorageAccessor = window.preloadApi.initLocalStorageAccessor(namePostfix)
  }

  setApplicationSettings = (settings: Array<ApplicationSetting>): void => {
    this.#localStorageAccessor.setApplicationSettings(settings)
  }

  getApplicationSettings = (): Array<ApplicationSetting> => {
    return this.#localStorageAccessor.getApplicationSettings()
  }

  setGitHubAccount = (account: GitHubAccount): void => {
    this.#localStorageAccessor.setGitHubAccount(account)
  }

  getGitHubAccount = (): GitHubAccount | undefined => {
    return this.#localStorageAccessor.getGitHubAccount()
  }

  setRepositorySettings = (settings: Array<RepositorySetting>): void => {
    this.#localStorageAccessor.setRepositorySettings(settings)
  }

  getRepositorySettings = (): Array<RepositorySetting> => {
    return this.#localStorageAccessor.getRepositorySettings()
  }

  deleteSettings = (): void => {
    this.#localStorageAccessor.deleteSettings()
  }
}
