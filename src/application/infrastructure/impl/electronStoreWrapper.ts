import Store from 'electron-store'
import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor'
import { ApplicationSetting } from '@/application/domain/model/application'
import { GitHubAccount, RepositorySetting } from '@/application/infrastructure/dto/local'

type StoreType = {
  account?: GitHubAccount;
  applicationSettings?: Array<ApplicationSetting>;
  repositorySettings?: Array<RepositorySetting>;
}

export class ElectronStoreWrapper implements LocalStorageAccessor {
  #store: Store<StoreType>

  constructor (namePostfix?: string) {
    const name = namePostfix === undefined ? 'config' : `config_${namePostfix}`
    this.#store = new Store<StoreType>({
      name
    })
  }

  getPath = (): string => {
    return this.#store.path
  }

  setApplicationSettings = (settings: Array<ApplicationSetting>): void => {
    this.#store.set('applicationSettings', settings)
  }

  getApplicationSettings = (): Array<ApplicationSetting> => {
    const s = this.#store.get('applicationSettings')
    return s === undefined ? [] : s
  }

  setGitHubAccount = (account: GitHubAccount): void => {
    this.#store.set('account', account)
  }

  getGitHubAccount = (): GitHubAccount | undefined => {
    return this.#store.get('account')
  }

  setRepositorySettings = (settings: Array<RepositorySetting>): void => {
    this.#store.set('repositorySettings', settings)
  }

  getRepositorySettings = (): Array<RepositorySetting> => {
    const settings = this.#store.get('repositorySettings')
    return settings === undefined ? [] : settings
  }
}
