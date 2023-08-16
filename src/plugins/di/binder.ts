import { App } from 'vue'
import {
  AccountSettingUseCaseFactoryKey,
  ApplicationSettingUseCaseKey,
  GitHubAccountUseCaseFactoryKey,
  GetCommitHistoryUseCaseFactoryKey,
  GetIssuesUseCaseFactoryKey,
  GetPullRequestsUseCaseFactoryKey,
  GetReleasesUseCaseFactoryKey,
  LogUseCaseKey,
  RepositorySettingUseCaseFactoryKey,
  WebBrowserUserCaseKey,
} from '@/plugins/di/types'
import {
  AccountSettingUseCaseFactoryImpl,
  ApplicationSettingUseCaseFactoryImpl,
  GetCommitHistoryUseCaseFactoryImpl,
  GetIssuesUseCaseFactoryImpl,
  GetPullRequestsUseCaseFactoryImpl,
  GetReleasesUseCaseFactoryImpl,
  GitHubAccountUseCaseFactoryImpl,
  RepositorySettingUseCaseFactoryImpl,
} from '@/application/usecase/factory/useCaseFactory'
import { LogUseCaseInteractor } from '@/application/usecase/interactor/LogUseCaseInteractor'
import { WebBrowserUserCaseInteractor } from '@/application/usecase/interactor/WebBrowserUserCaseInteractor'

const accountSettingUseCaseFactory = new AccountSettingUseCaseFactoryImpl()
const webBrowserUserCaseInteractor = new WebBrowserUserCaseInteractor()
const logUseCaseInteractor = new LogUseCaseInteractor()

const applicationSettingUseCase =
  new ApplicationSettingUseCaseFactoryImpl().newApplicationSettingUseCase()
const gitHubAccountUseCaseFactory = new GitHubAccountUseCaseFactoryImpl()
const repositorySettingUseCaseFactory = new RepositorySettingUseCaseFactoryImpl()

const getCommitHistoryUseCaseFactory = new GetCommitHistoryUseCaseFactoryImpl()
const getIssuesUseCaseFactory = new GetIssuesUseCaseFactoryImpl()
const getPullRequestsUseCaseFactory = new GetPullRequestsUseCaseFactoryImpl()
const getReleasesUseCaseFactory = new GetReleasesUseCaseFactoryImpl()

export default {
  install(app: App): void {
    app.provide(AccountSettingUseCaseFactoryKey, accountSettingUseCaseFactory)
    app.provide(ApplicationSettingUseCaseKey, applicationSettingUseCase)
    app.provide(GitHubAccountUseCaseFactoryKey, gitHubAccountUseCaseFactory)
    app.provide(GetCommitHistoryUseCaseFactoryKey, getCommitHistoryUseCaseFactory)
    app.provide(GetIssuesUseCaseFactoryKey, getIssuesUseCaseFactory)
    app.provide(GetPullRequestsUseCaseFactoryKey, getPullRequestsUseCaseFactory)
    app.provide(GetReleasesUseCaseFactoryKey, getReleasesUseCaseFactory)
    app.provide(LogUseCaseKey, logUseCaseInteractor)
    app.provide(WebBrowserUserCaseKey, webBrowserUserCaseInteractor)
    app.provide(RepositorySettingUseCaseFactoryKey, repositorySettingUseCaseFactory)
  },
}
