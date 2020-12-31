import Store from 'electron-store'
import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { GitHubUser } from '@/model/githubUser'

type StoreType = {
  personalAccessToken?: string;
  user?: GitHubUser;
  githubRepositoryUrls?: Array<string>;
}

const store = new Store<StoreType>()

export class ElectronStoreWrapper implements LocalStorageAccessor {
  setPersonalAccessToken (pat: string): void {
    store.set('personalAccessToken', pat)
  }

  getPersonalAccessToken (): string | undefined {
    return store.get('personalAccessToken')
  }

  setUser (user: GitHubUser): void {
    store.set('user', user)
  }

  getUser (): GitHubUser | undefined {
    return store.get('user')
  }

  setGitHubRepositoryUrls (urls: Array<string>): void {
    store.set('githubRepositoryUrls', urls)
  }

  getGitHubRepositoryUrls (): Array<string> {
    const urls = store.get('githubRepositoryUrls')
    return urls === undefined ? [] : urls
  }

  deleteGitHubRepositoryUrls (): void {
    store.delete('githubRepositoryUrls')
  }
}
