import { InjectionKey } from 'vue'
import { AccountSettingUseCaseFactory } from '@/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/usecase/applicationSetting'
import { GitHubAccountUseCaseFactory } from '@/usecase/githubAccount'
import { GitHubRepositoryUseCaseFactory } from '@/usecase/githubRepository'
import { RepositorySettingUseCaseFactory } from '@/usecase/repositorySetting'
import { WebBrowserUserCase } from '@/usecase/webBrowser'

export const AccountSettingUseCaseFactoryKey: InjectionKey<AccountSettingUseCaseFactory> = Symbol('AccountSettingUseCaseFactory')
export const ApplicationSettingUseCaseKey: InjectionKey<ApplicationSettingUseCase> = Symbol('ApplicationSettingUseCase')
export const GitHubAccountUseCaseFactoryKey: InjectionKey<GitHubAccountUseCaseFactory> = Symbol('GitHubAccountUseCaseFactory')
export const GitHubRepositoryUseCaseFactoryKey: InjectionKey<GitHubRepositoryUseCaseFactory> = Symbol('GitHubRepositoryUseCaseFactory')
export const RepositorySettingUseCaseFactoryKey: InjectionKey<RepositorySettingUseCaseFactory> = Symbol('RepositorySettingUseCaseFactory')
export const WebBrowserUserCaseKey: InjectionKey<WebBrowserUserCase> = Symbol('WebBrowserUserCaseKey')
