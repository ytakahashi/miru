import { InjectionKey } from 'vue'
import { GitHubRepositoryUseCaseFactory } from '@/usecase/githubRepository'
import { WebBrowserUserCase } from '@/usecase/webBrowser'

export const WebBrowserUserCaseKey: InjectionKey<WebBrowserUserCase> = Symbol('WebBrowserUserCaseKey')
export const GitHubRepositoryUseCaseFactoryKey: InjectionKey<GitHubRepositoryUseCaseFactory> = Symbol('GitHubRepositoryUseCaseFactory')
