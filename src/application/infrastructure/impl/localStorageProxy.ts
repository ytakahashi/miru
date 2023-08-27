import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor'
import { ApplicationSetting } from '@/application/domain/model/application'
import { GitHubAccount, RepositorySetting } from '@/application/infrastructure/dto/local'

export class LocalStorageProxy implements LocalStorageAccessor {
  #wrapper: LocalStorageAccessor

  constructor(namePostfix?: string) {
    console.log('window.preloadApi')
    console.log(window.preloadApi)
    this.#wrapper = window.preloadApi.initElectronStoreWrapper(namePostfix)
  }

  getPath = (): string => {
    return this.#wrapper.getPath()
  }

  setApplicationSettings = (settings: Array<ApplicationSetting>): void => {
    console.log('LocalStorageProxy#setApplicationSettings')
    this.#wrapper.setApplicationSettings(settings)
  }

  getApplicationSettings = (): Array<ApplicationSetting> => {
    console.log('LocalStorageProxy#getApplicationSettings')

    return this.#wrapper.getApplicationSettings()
  }

  setGitHubAccount = (account: GitHubAccount): void => {
    console.log('LocalStorageProxy#setGitHubAccount:')
    console.log(JSON.stringify(account))

    this.#wrapper.setGitHubAccount(account)
  }

  getGitHubAccount = (): GitHubAccount | undefined => {
    console.log('LocalStorageProxy#getGitHubAccount')
    return this.#wrapper.getGitHubAccount()
  }

  setRepositorySettings = (settings: Array<RepositorySetting>): void => {
    console.log('LocalStorageProxy#setRepositorySettings')
    this.#wrapper.setRepositorySettings(settings)
  }

  getRepositorySettings = (): Array<RepositorySetting> => {
    console.log('LocalStorageProxy#getRepositorySettings')
    return this.#wrapper.getRepositorySettings()
  }
}
