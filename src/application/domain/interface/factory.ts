import { GitHubAccessor } from '@/application/domain/interface/githubAccessor'
import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor'
import { GitHubUrl } from '@/application/domain/model/github'
import { GitHubGraphQLClient } from '@/application/infrastructure/impl/githubGraphQLClient'

export const newGitHubAccessor = (gitHubUrl: GitHubUrl): GitHubAccessor => {
  return new GitHubGraphQLClient(gitHubUrl)
}

export const newLocalStorageAccessor = (configPostfix?: string): LocalStorageAccessor => {
  return window.preloadApi.initLocalStorageAccessor(configPostfix)
}
