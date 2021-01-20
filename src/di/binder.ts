import { App } from 'vue'
import {
  AccountSettingUseCaseFactoryKey,
  GitHubRepositoryUseCaseFactoryKey,
  WebBrowserUserCaseKey
} from '@/di/types'
import {
  AccountSettingUseCaseFactoryImpl,
  GitHubRepositoryUseCaseFactoryImpl
} from '@/usecase/factory/useCaseFactory'
import { WebBrowserUserCaseInteractor } from '@/usecase/interactor/WebBrowserUserCaseInteractor'

const accountSettingUseCaseFactory = new AccountSettingUseCaseFactoryImpl()
const githubRepositoryUseCaseFactory = new GitHubRepositoryUseCaseFactoryImpl()
const webBrowserUserCaseInteractor = new WebBrowserUserCaseInteractor()

export default {
  install (app: App): void {
    app.provide(AccountSettingUseCaseFactoryKey, accountSettingUseCaseFactory)
    app.provide(GitHubRepositoryUseCaseFactoryKey, githubRepositoryUseCaseFactory)
    app.provide(WebBrowserUserCaseKey, webBrowserUserCaseInteractor)
  }
}
