/* eslint-disable @typescript-eslint/no-unused-vars */

import { shallowMount } from '@vue/test-utils'
import GitHubIssue from '@/components/GitHubIssue.vue'
import IssueContent from '@/components/IssueContent.vue'
import { GitHubRepositoryUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/di/types'
import { Account, GitHubUrl, Issue, Issues, PullRequests, Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { GitHubRepositoryUseCase, GitHubRepositoryUseCaseFactory } from '@/application/usecase/githubRepository'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'

const MockedGitHubRepositoryUseCase = jest.fn<GitHubRepositoryUseCase, [Issues]>()
MockedGitHubRepositoryUseCase.mockImplementation((issues: Issues): GitHubRepositoryUseCase => {
  return {
    getIssues: async (): Promise<Issues> => issues,
    getPullRequests: async (): Promise<PullRequests> => jest.fn<PullRequests, []>()(),
    getReleases: async (): Promise<Releases> => jest.fn<Releases, []>()()
  }
})
const createMock = (func: () => GitHubRepositoryUseCase): GitHubRepositoryUseCaseFactory => {
  return {
    newGitHubRepositoryUseCase: (githubUrl: GitHubUrl, personalAccessToken: string) => func()
  }
}

const MockedWebBrowserUserCase = jest.fn<WebBrowserUserCase, []>()
const openUrlMock = jest.fn()
MockedWebBrowserUserCase.mockImplementation((): WebBrowserUserCase => {
  return {
    openUrl: (url: string) => openUrlMock(url)
  }
})
const mockedWebBrowserUserCase = new MockedWebBrowserUserCase()

const account = new Account('name', 'profile', 'avatar', jest.fn<GitHubUrl, []>()(), 'pat')
const setting = new RepositorySetting('https://github.com/ytakahashi/miru')

describe('GitHubIssue.vue', () => {
  beforeEach(() => {
    openUrlMock.mockClear()
  })

  it('renders when open issue does not exist', async () => {
    const issues = new Issues(setting, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(issues)),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        account: account,
        repositorySetting: setting,
        option: {}
      }
    })
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).toContain('There aren’t any open issues.')
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(0)
    expect(openUrlMock).not.toHaveBeenCalled()
  })

  it('renders when 2 open issues exist', async () => {
    const issue1 = new Issue(
      'author 1',
      'issue title 1',
      'issue url 1',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [],
      2,
      3
    )
    const issue2 = new Issue(
      'author 2',
      'issue title 2',
      'issue url 2',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      124,
      [],
      2,
      3
    )
    const issues = new Issues(setting, [issue1, issue2], 2)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(issues)),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        account: account,
        repositorySetting: setting,
        option: {}
      }
    })
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).not.toContain('There aren’t any open issues.')
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(2)
    expect(openUrlMock).not.toHaveBeenCalled()
  })

  it('opens repository url', async () => {
    const issues = new Issues(setting, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(issues)),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        account: account,
        repositorySetting: setting,
        option: {}
      }
    })
    await wrapper.find('span.text-strong').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith(setting.getUrl())
  })

  it('opens issues url', async () => {
    const issues = new Issues(setting, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(issues)),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        account: account,
        repositorySetting: setting,
        option: {}
      }
    })

    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.find('div.clickable').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith(`${setting.getUrl()}/issues`)
  })
})
