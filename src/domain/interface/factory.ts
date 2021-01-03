import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { ElectronStoreWrapper } from '@/infrastructure/ElectronStoreWrapper'
import { GitHubGraphQLClient } from '@/infrastructure/githubGraphQLClient'

export const newGitHubAccessor = (apiEndpoint: string, pat: string): GitHubAccessor => {
  return new GitHubGraphQLClient(apiEndpoint, pat)
}

export const newLocalStorageAccessor = (configPostfix?: string): LocalStorageAccessor => {
  return new ElectronStoreWrapper(configPostfix)
}
