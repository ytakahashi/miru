import { App } from 'vue'
import {
  GitHubRepositoryUseCaseFactoryKey,
  WebBrowserUserCaseKey
} from '@/di/types'
import { GitHubRepositoryUseCaseFactoryImpl } from '@/usecase/factory/useCaseFactory'
import { WebBrowserUserCaseInteractor } from '@/usecase/interactor/WebBrowserUserCaseInteractor'

const webBrowserUserCaseInteractor = new WebBrowserUserCaseInteractor()
const githubRepositoryUseCaseFactory = new GitHubRepositoryUseCaseFactoryImpl()

export default {
  install (app: App): void {
    app.provide(WebBrowserUserCaseKey, webBrowserUserCaseInteractor)
    app.provide(GitHubRepositoryUseCaseFactoryKey, githubRepositoryUseCaseFactory)
  }
}
