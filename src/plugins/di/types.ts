import { InjectionKey } from 'vue'
import { AccountSettingUseCaseFactory } from '@/application/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/application/usecase/applicationSetting'
import { GitHubAccountUseCaseFactory } from '@/application/usecase/githubAccount'
import {
  GetCommitHistoryUseCaseFactory,
  GetIssuesUseCaseFactory,
  GetPullRequestsUseCaseFactory,
  GetReleasesUseCaseFactory,
} from '@/application/usecase/githubRepository'
import { LogUseCase } from '@/application/usecase/log'
import { RepositorySettingUseCaseFactory } from '@/application/usecase/repositorySetting'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'

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
export const LogUseCaseKey: InjectionKey<LogUseCase> = Symbol('LogUseCase')
export const RepositorySettingUseCaseFactoryKey: InjectionKey<RepositorySettingUseCaseFactory> =
  Symbol('RepositorySettingUseCaseFactory')
export const WebBrowserUserCaseKey: InjectionKey<WebBrowserUserCase> =
  Symbol('WebBrowserUserCaseKey')
