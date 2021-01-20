import { App } from 'vue'
import {
  AccountSettingUseCaseFactoryKey,
  ApplicationSettingUseCaseKey,
  GitHubAccountUseCaseFactoryKey,
  GitHubRepositoryUseCaseFactoryKey,
  WebBrowserUserCaseKey
} from '@/di/types'
import {
  AccountSettingUseCaseFactoryImpl,
  ApplicationSettingUseCaseFactoryImpl,
  GitHubAccountUseCaseFactoryImpl,
  GitHubRepositoryUseCaseFactoryImpl
} from '@/usecase/factory/useCaseFactory'
import { WebBrowserUserCaseInteractor } from '@/usecase/interactor/WebBrowserUserCaseInteractor'

const accountSettingUseCaseFactory = new AccountSettingUseCaseFactoryImpl()
const githubRepositoryUseCaseFactory = new GitHubRepositoryUseCaseFactoryImpl()
const webBrowserUserCaseInteractor = new WebBrowserUserCaseInteractor()

const applicationSettingUseCase = new ApplicationSettingUseCaseFactoryImpl().newApplicationSettingUseCase()
const gitHubAccountUseCaseFactory = new GitHubAccountUseCaseFactoryImpl()

export default {
  install (app: App): void {
    app.provide(AccountSettingUseCaseFactoryKey, accountSettingUseCaseFactory)
    app.provide(ApplicationSettingUseCaseKey, applicationSettingUseCase)
    app.provide(GitHubAccountUseCaseFactoryKey, gitHubAccountUseCaseFactory)
    app.provide(GitHubRepositoryUseCaseFactoryKey, githubRepositoryUseCaseFactory)
    app.provide(WebBrowserUserCaseKey, webBrowserUserCaseInteractor)
  }
}
