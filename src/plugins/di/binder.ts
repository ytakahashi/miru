import { newLogger, newWebBrowser } from '@/application/composition/adapterFactory.js'
import {
  AccountSettingUseCaseFactoryImpl,
  ApplicationSettingUseCaseFactoryImpl,
  GetCommitHistoryUseCaseFactoryImpl,
  GetIssuesUseCaseFactoryImpl,
  GetPullRequestsUseCaseFactoryImpl,
  GetReleasesUseCaseFactoryImpl,
  GitHubAccountUseCaseFactoryImpl,
  RepositorySettingUseCaseFactoryImpl,
} from '@/application/composition/useCaseFactory.js'
import {
  AccountSettingUseCaseFactoryKey,
  ApplicationSettingUseCaseKey,
  GetCommitHistoryUseCaseFactoryKey,
  GetIssuesUseCaseFactoryKey,
  GetPullRequestsUseCaseFactoryKey,
  GetReleasesUseCaseFactoryKey,
  GitHubAccountUseCaseFactoryKey,
  LoggerKey,
  RepositorySettingUseCaseFactoryKey,
  WebBrowserKey,
} from '@/plugins/di/types.js'
import { App } from 'vue'

const accountSettingUseCaseFactory = new AccountSettingUseCaseFactoryImpl()
const logger = newLogger()
const webBrowser = newWebBrowser()

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
    app.provide(LoggerKey, logger)
    app.provide(WebBrowserKey, webBrowser)
    app.provide(RepositorySettingUseCaseFactoryKey, repositorySettingUseCaseFactory)
  },
}
