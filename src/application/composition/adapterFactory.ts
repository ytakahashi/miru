import { GitHubAccessor } from '@/application/domain/interface/githubAccessor.js'
import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor.js'
import { Logger } from '@/application/domain/interface/logger.js'
import { WebBrowser } from '@/application/domain/interface/webBrowser.js'
import { GitHubUrl } from '@/application/domain/model/github.js'
import { GitHubGraphQLClient } from '@/application/infrastructure/impl/githubGraphQLClient.js'

// Concrete adapter construction is kept out of domain/ and usecase/ so that neither layer
// statically depends on infrastructure classes or the window.preloadApi bridge. This module,
// together with useCaseFactory.ts, is the renderer's composition root.
export const newGitHubAccessor = (gitHubUrl: GitHubUrl): GitHubAccessor => {
  return new GitHubGraphQLClient(gitHubUrl, newLogger())
}

export const newLocalStorageAccessor = (configPostfix?: string): LocalStorageAccessor => {
  return window.preloadApi.initLocalStorageAccessor(configPostfix)
}

export const newLogger = (): Logger => {
  return window.preloadApi.initLogger()
}

export const newWebBrowser = (): WebBrowser => {
  return window.preloadApi.initWebBrowser()
}
