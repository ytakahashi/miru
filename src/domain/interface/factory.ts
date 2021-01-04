import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { ElectronStoreWrapper } from '@/infrastructure/ElectronStoreWrapper'
import { GitHubGraphQLClient } from '@/infrastructure/githubGraphQLClient'
import { GitHubUrl } from '@/model/github'

export const newGitHubAccessor = (gitHubUrl: GitHubUrl): GitHubAccessor => {
  return new GitHubGraphQLClient(gitHubUrl)
}

export const newLocalStorageAccessor = (configPostfix?: string): LocalStorageAccessor => {
  return new ElectronStoreWrapper(configPostfix)
}
