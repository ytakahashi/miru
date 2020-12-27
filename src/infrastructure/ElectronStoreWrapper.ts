import Store from 'electron-store'
import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { GitHubUser } from '@/model/github'

type StoreType = {
  personalAccessToken?: string;
  user?: GitHubUser;
  repositoryUrls?: Array<string>;
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
}
