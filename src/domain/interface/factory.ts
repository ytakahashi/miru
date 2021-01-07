import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { GitHubUrl } from '@/domain/model/github'
import { ElectronStoreWrapper } from '@/infrastructure/impl/electronStoreWrapper'
import { GitHubGraphQLClient } from '@/infrastructure/impl/githubGraphQLClient'

export const newGitHubAccessor = (gitHubUrl: GitHubUrl): GitHubAccessor => {
  return new GitHubGraphQLClient(gitHubUrl)
}

export const newLocalStorageAccessor = (configPostfix?: string): LocalStorageAccessor => {
  return new ElectronStoreWrapper(configPostfix)
}
