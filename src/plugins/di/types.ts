import { Logger } from '@/application/domain/interface/logger.js'
import { WebBrowser } from '@/application/domain/interface/webBrowser.js'
import { AccountSettingUseCaseFactory } from '@/application/usecase/accountSetting.js'
import { ApplicationSettingUseCase } from '@/application/usecase/applicationSetting.js'
import { GitHubAccountUseCaseFactory } from '@/application/usecase/githubAccount.js'
import {
  GetCommitHistoryUseCaseFactory,
  GetIssuesUseCaseFactory,
  GetPullRequestsUseCaseFactory,
  GetReleasesUseCaseFactory,
} from '@/application/usecase/githubRepository.js'
import { RepositorySettingUseCaseFactory } from '@/application/usecase/repositorySetting.js'
import { InjectionKey } from 'vue'

export const AccountSettingUseCaseFactoryKey: InjectionKey<AccountSettingUseCaseFactory> = Symbol(
  'AccountSettingUseCaseFactory'
)
export const ApplicationSettingUseCaseKey: InjectionKey<ApplicationSettingUseCase> = Symbol(
  'ApplicationSettingUseCase'
)
export const GitHubAccountUseCaseFactoryKey: InjectionKey<GitHubAccountUseCaseFactory> = Symbol(
  'GitHubAccountUseCaseFactory'
)
export const GetCommitHistoryUseCaseFactoryKey: InjectionKey<GetCommitHistoryUseCaseFactory> =
  Symbol('GetCommitHistoryUseCaseFactory')
export const GetIssuesUseCaseFactoryKey: InjectionKey<GetIssuesUseCaseFactory> =
  Symbol('GetIssuesUseCaseFactory')
export const GetPullRequestsUseCaseFactoryKey: InjectionKey<GetPullRequestsUseCaseFactory> = Symbol(
  'GetPullRequestsUseCaseFactory'
)
export const GetReleasesUseCaseFactoryKey: InjectionKey<GetReleasesUseCaseFactory> = Symbol(
  'GetReleasesUseCaseFactory'
)
export const RepositorySettingUseCaseFactoryKey: InjectionKey<RepositorySettingUseCaseFactory> =
  Symbol('RepositorySettingUseCaseFactory')
export const LoggerKey: InjectionKey<Logger> = Symbol('LoggerKey')
export const WebBrowserKey: InjectionKey<WebBrowser> = Symbol('WebBrowserKey')
