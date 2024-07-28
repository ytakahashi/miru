import { GitHubAccessor } from '@/application/domain/interface/githubAccessor.js'
import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor.js'
import { GitHubUrl } from '@/application/domain/model/github.js'
import { GitHubGraphQLClient } from '@/application/infrastructure/impl/githubGraphQLClient.js'

export const newGitHubAccessor = (gitHubUrl: GitHubUrl): GitHubAccessor => {
  return new GitHubGraphQLClient(gitHubUrl)
}

export const newLocalStorageAccessor = (configPostfix?: string): LocalStorageAccessor => {
  return window.preloadApi.initLocalStorageAccessor(configPostfix)
}
