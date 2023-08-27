import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor'
import { ApplicationSetting } from '@/application/domain/model/application'
import { GitHubAccount, RepositorySetting } from '@/application/infrastructure/dto/local'

export class LocalStorageProxy implements LocalStorageAccessor {
  #wrapper: LocalStorageAccessor

  constructor(namePostfix?: string) {
    this.#wrapper = window.preloadApi.initElectronStoreWrapper(namePostfix)
  }

  getPath = (): string => {
    return this.#wrapper.getPath()
  }

  setApplicationSettings = (settings: Array<ApplicationSetting>): void => {
    this.#wrapper.setApplicationSettings(settings)
  }

  getApplicationSettings = (): Array<ApplicationSetting> => {
    return this.#wrapper.getApplicationSettings()
  }

  setGitHubAccount = (account: GitHubAccount): void => {
    this.#wrapper.setGitHubAccount(account)
  }

  getGitHubAccount = (): GitHubAccount | undefined => {
    return this.#wrapper.getGitHubAccount()
  }

  setRepositorySettings = (settings: Array<RepositorySetting>): void => {
    this.#wrapper.setRepositorySettings(settings)
  }

  getRepositorySettings = (): Array<RepositorySetting> => {
    return this.#wrapper.getRepositorySettings()
  }
}
