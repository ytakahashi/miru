import Store from 'electron-store'
import { LocalStorageAccessor, RepositorySetting } from '@/domain/interface/localStorageAccessor'
import { ApplicationSetting } from '@/domain/model/application'
import { GitHubUser } from '@/infrastructure/dto/githubApi'
import { GitHubAccount } from '@/infrastructure/dto/local'

type StoreType = {
  personalAccessToken?: string;
  user?: GitHubUser;
  account?: GitHubAccount;
  githubRepositoryUrls?: Array<string>;
  applicationSettings?: Array<ApplicationSetting>;
  repositorySettings?: Array<RepositorySetting>;
}

export class ElectronStoreWrapper implements LocalStorageAccessor {
  #store: Store<StoreType>

  constructor (namePostfix?: string) {
    const name = namePostfix === undefined ? 'config' : `config_${namePostfix}`
    this.#store = new Store<StoreType>({
      name: name
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

  setPersonalAccessToken = (pat: string): void => {
    this.#store.set('personalAccessToken', pat)
  }

  getPersonalAccessToken = (): string | undefined => {
    return this.#store.get('personalAccessToken')
  }

  setUser = (user: GitHubUser): void => {
    this.#store.set('user', user)
  }

  getUser = (): GitHubUser | undefined => {
    return this.#store.get('user')
  }

  setGitHubAccount = (account: GitHubAccount): void => {
    this.#store.set('account', account)
  }

  getGitHubAccount = (): GitHubAccount | undefined => {
    return this.#store.get('account')
  }

  setGitHubRepositoryUrls = (urls: Array<string>): void => {
    this.#store.set('githubRepositoryUrls', urls)
  }

  getGitHubRepositoryUrls = (): Array<string> => {
    const urls = this.#store.get('githubRepositoryUrls')
    return urls === undefined ? [] : urls
  }

  deleteGitHubRepositoryUrls = (): void => {
    this.#store.delete('githubRepositoryUrls')
  }

  setRepositorySettings = (settings: Array<RepositorySetting>): void => {
    this.#store.set('repositorySettings', settings)
  }

  getRepositorySettings = (): Array<RepositorySetting> => {
    const settings = this.#store.get('repositorySettings')
    return settings === undefined ? [] : settings
  }

  deleteRepositorySettings = (): void => {
    this.#store.delete('repositorySettings')
  }
}
