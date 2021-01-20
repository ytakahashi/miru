import { InjectionKey } from 'vue'
import { AccountSettingUseCaseFactory } from '@/usecase/accountSetting'
import { GitHubRepositoryUseCaseFactory } from '@/usecase/githubRepository'
import { WebBrowserUserCase } from '@/usecase/webBrowser'

export const AccountSettingUseCaseFactoryKey: InjectionKey<AccountSettingUseCaseFactory> = Symbol('AccountSettingUseCaseFactory')
export const GitHubRepositoryUseCaseFactoryKey: InjectionKey<GitHubRepositoryUseCaseFactory> = Symbol('GitHubRepositoryUseCaseFactory')
export const WebBrowserUserCaseKey: InjectionKey<WebBrowserUserCase> = Symbol('WebBrowserUserCaseKey')
