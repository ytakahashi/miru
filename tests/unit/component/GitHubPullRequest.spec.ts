/* eslint-disable @typescript-eslint/no-unused-vars */

import { shallowMount } from '@vue/test-utils'
import GitHubPullRequest from '@/components/GitHubPullRequest.vue'
import PullRequestContent from '@/components/PullRequestContent.vue'
import { GitHubRepositoryUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/di/types'
import { Account, GitHubUrl, Issues, PullRequest, PullRequests } from '@/domain/model/github'
import { RepositorySetting } from '@/domain/model/githubRepository'
import { GitHubRepositoryUseCase, GitHubRepositoryUseCaseFactory } from '@/usecase/githubRepository'
import { WebBrowserUserCase } from '@/usecase/webBrowser'

const MockedIssues = jest.fn<Issues, []>()

const MockedGitHubRepositoryUseCase = jest.fn<GitHubRepositoryUseCase, [PullRequests]>()
MockedGitHubRepositoryUseCase.mockImplementation((pr: PullRequests): GitHubRepositoryUseCase => {
  return {
    getIssues: async (): Promise<Issues> => new MockedIssues(),
    getPullRequests: async (): Promise<PullRequests> => pr
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

describe('GitHubPullRequest.vue', () => {
  beforeEach(() => {
    openUrlMock.mockClear()
  })

  it('renders when open PR does not exist', async () => {
    const pullRequests = new PullRequests(setting, [], 0)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(pullRequests)),
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
    expect(wrapper.text()).toContain('There aren’t any open pull requests.')
    expect(wrapper.findAllComponents(PullRequestContent)).toHaveLength(0)
  })

  it('renders when 2 open PRs exist', async () => {
    const pr1 = new PullRequest(
      'author 1',
      123,
      'pr title 1',
      'pr url 1',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      [],
      2,
      3,
      123,
      456,
      7
    )
    const pr2 = new PullRequest(
      'author 2',
      124,
      'pr title 2',
      'pr url 2',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      [],
      2,
      3,
      234,
      567,
      8
    )
    const pullRequests = new PullRequests(setting, [pr1, pr2], 2)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(pullRequests)),
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
    expect(wrapper.text()).not.toContain('There aren’t any open pull requests.')
    expect(wrapper.findAllComponents(PullRequestContent)).toHaveLength(2)
  })

  it('opens repository url', async () => {
    const pullRequests = new PullRequests(setting, [], 0)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(pullRequests)),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        account: account,
        repositorySetting: setting,
        option: {}
      }
    })
    await wrapper.find('span.repository-name').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith(setting.getUrl())
  })

  it('opens pill requests url', async () => {
    const pullRequests = new PullRequests(setting, [], 0)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(pullRequests)),
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
    expect(openUrlMock).toHaveBeenCalledWith(`${setting.getUrl()}/pulls`)
  })
})
