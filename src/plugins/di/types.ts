import { InjectionKey } from 'vue'
import { AccountSettingUseCaseFactory } from '@/application/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/application/usecase/applicationSetting'
import { GitHubAccountUseCaseFactory } from '@/application/usecase/githubAccount'
import { GitHubRepositoryUseCaseFactory } from '@/application/usecase/githubRepository'
import { RepositorySettingUseCaseFactory } from '@/application/usecase/repositorySetting'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'

export const AccountSettingUseCaseFactoryKey: InjectionKey<AccountSettingUseCaseFactory> = Symbol('AccountSettingUseCaseFactory')
export const ApplicationSettingUseCaseKey: InjectionKey<ApplicationSettingUseCase> = Symbol('ApplicationSettingUseCase')
export const GitHubAccountUseCaseFactoryKey: InjectionKey<GitHubAccountUseCaseFactory> = Symbol('GitHubAccountUseCaseFactory')
export const GitHubRepositoryUseCaseFactoryKey: InjectionKey<GitHubRepositoryUseCaseFactory> = Symbol('GitHubRepositoryUseCaseFactory')
export const RepositorySettingUseCaseFactoryKey: InjectionKey<RepositorySettingUseCaseFactory> = Symbol('RepositorySettingUseCaseFactory')
export const WebBrowserUserCaseKey: InjectionKey<WebBrowserUserCase> = Symbol('WebBrowserUserCaseKey')
