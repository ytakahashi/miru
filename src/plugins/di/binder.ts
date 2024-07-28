import {
  AccountSettingUseCaseFactoryImpl,
  ApplicationSettingUseCaseFactoryImpl,
  GetCommitHistoryUseCaseFactoryImpl,
  GetIssuesUseCaseFactoryImpl,
  GetPullRequestsUseCaseFactoryImpl,
  GetReleasesUseCaseFactoryImpl,
  GitHubAccountUseCaseFactoryImpl,
  RepositorySettingUseCaseFactoryImpl,
} from '@/application/usecase/factory/useCaseFactory.js'
import { WebBrowserUserCaseInteractor } from '@/application/usecase/interactor/WebBrowserUserCaseInteractor.js'
import {
  AccountSettingUseCaseFactoryKey,
  ApplicationSettingUseCaseKey,
  GetCommitHistoryUseCaseFactoryKey,
  GetIssuesUseCaseFactoryKey,
  GetPullRequestsUseCaseFactoryKey,
  GetReleasesUseCaseFactoryKey,
  GitHubAccountUseCaseFactoryKey,
  RepositorySettingUseCaseFactoryKey,
  WebBrowserUserCaseKey,
} from '@/plugins/di/types.js'
import { App } from 'vue'

const accountSettingUseCaseFactory = new AccountSettingUseCaseFactoryImpl()
const webBrowserUserCaseInteractor = new WebBrowserUserCaseInteractor()

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
    app.provide(WebBrowserUserCaseKey, webBrowserUserCaseInteractor)
    app.provide(RepositorySettingUseCaseFactoryKey, repositorySettingUseCaseFactory)
  },
}
