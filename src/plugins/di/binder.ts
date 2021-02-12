import { App } from 'vue'
import {
  AccountSettingUseCaseFactoryKey,
  ApplicationSettingUseCaseKey,
  GitHubAccountUseCaseFactoryKey,
  GitHubRepositoryUseCaseFactoryKey,
  LogUseCaseKey,
  RepositorySettingUseCaseFactoryKey,
  WebBrowserUserCaseKey
} from '@/plugins/di/types'
import {
  AccountSettingUseCaseFactoryImpl,
  ApplicationSettingUseCaseFactoryImpl,
  GitHubAccountUseCaseFactoryImpl,
  GitHubRepositoryUseCaseFactoryImpl,
  RepositorySettingUseCaseFactoryImpl
} from '@/application/usecase/factory/useCaseFactory'
import { LogUseCaseInteractor } from '@/application/usecase/interactor/LogUseCaseInteractor'
import { WebBrowserUserCaseInteractor } from '@/application/usecase/interactor/WebBrowserUserCaseInteractor'

const accountSettingUseCaseFactory = new AccountSettingUseCaseFactoryImpl()
const githubRepositoryUseCaseFactory = new GitHubRepositoryUseCaseFactoryImpl()
const webBrowserUserCaseInteractor = new WebBrowserUserCaseInteractor()
const logUseCaseInteractor = new LogUseCaseInteractor()

const applicationSettingUseCase = new ApplicationSettingUseCaseFactoryImpl().newApplicationSettingUseCase()
const gitHubAccountUseCaseFactory = new GitHubAccountUseCaseFactoryImpl()
const repositorySettingUseCaseFactory = new RepositorySettingUseCaseFactoryImpl()

export default {
  install (app: App): void {
    app.provide(AccountSettingUseCaseFactoryKey, accountSettingUseCaseFactory)
    app.provide(ApplicationSettingUseCaseKey, applicationSettingUseCase)
    app.provide(GitHubAccountUseCaseFactoryKey, gitHubAccountUseCaseFactory)
    app.provide(GitHubRepositoryUseCaseFactoryKey, githubRepositoryUseCaseFactory)
    app.provide(LogUseCaseKey, logUseCaseInteractor)
    app.provide(WebBrowserUserCaseKey, webBrowserUserCaseInteractor)
    app.provide(RepositorySettingUseCaseFactoryKey, repositorySettingUseCaseFactory)
  }
}
