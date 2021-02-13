/* eslint-disable @typescript-eslint/no-unused-vars */

import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { Account, GitHubUrl, Issue, Issues, PullRequests, Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { GitHubRepositoryUseCase, GitHubRepositoryUseCaseFactory } from '@/application/usecase/githubRepository'
import { LogUseCase } from '@/application/usecase/log'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import { GitHubRepositoryUseCaseFactoryKey, LogUseCaseKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
import GitHubIssue from '@/views/issues/GitHubIssue.vue'
import IssueContent from '@/views/issues/IssueContent.vue'

// GitHubRepositoryUseCase mock
const MockedGitHubRepositoryUseCase = jest.fn<GitHubRepositoryUseCase, [() => Issues]>()
MockedGitHubRepositoryUseCase.mockImplementation((cb: () => Issues): GitHubRepositoryUseCase => {
  return {
    getIssues: async (): Promise<Issues> => cb(),
    getPullRequests: async (): Promise<PullRequests> => jest.fn<PullRequests, []>()(),
    getReleases: async (): Promise<Releases> => jest.fn<Releases, []>()()
  }
})
const createMock = (func: () => GitHubRepositoryUseCase): GitHubRepositoryUseCaseFactory => {
  return {
    newGitHubRepositoryUseCase: (githubUrl: GitHubUrl, personalAccessToken: string) => func()
  }
}

// LogUseCase mock
const errorMock = jest.fn()
const MockedLogUseCase = jest.fn<LogUseCase, []>()
MockedLogUseCase.mockImplementation((): LogUseCase => {
  return {
    error: (e: Error) => errorMock(e)
  }
})
const mockedLogUseCase = new MockedLogUseCase()

// WebBrowserUserCase mock
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
    errorMock.mockClear()
    openUrlMock.mockClear()
  })

  it('renders when open issue does not exist', async () => {
    const issues = new Issues(setting, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(() => issues)),
          [LogUseCaseKey as symbol]: mockedLogUseCase,
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        account: account,
        repositorySetting: setting,
        option: {}
      }
    })

    // when: click button
    await wrapper.find('.get-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: message appears
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
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(() => issues)),
          [LogUseCaseKey as symbol]: mockedLogUseCase,
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        account: account,
        repositorySetting: setting,
        option: {}
      }
    })

    // when: click button
    await wrapper.find('.get-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: issues appears
    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).not.toContain('There aren’t any open issues.')
    expect(wrapper.find('.clear-button').exists()).toBe(true)
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(2)
    expect(openUrlMock).not.toHaveBeenCalled()

    // when: click clear button
    await wrapper.find('.clear-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: issues disappears
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(0)
    expect(openUrlMock).not.toHaveBeenCalled()
  })

  it('fails to get issues', async () => {
    const err = new Error('error')
    const supplier = () => {
      throw err
    }

    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(supplier)),
          [LogUseCaseKey as symbol]: mockedLogUseCase,
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        account: account,
        repositorySetting: setting,
        option: {}
      }
    })

    // when: click clear button
    await wrapper.find('.get-button').trigger('click').then(() => nextTick())

    // then: error mock is called
    expect(errorMock).toHaveBeenCalledWith(err)
  })

  it('opens repository url', async () => {
    const issues = new Issues(setting, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(() => issues)),
          [LogUseCaseKey as symbol]: mockedLogUseCase,
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        account: account,
        repositorySetting: setting,
        option: {}
      }
    })

    // when: click header text
    await wrapper.find('span.text-strong').trigger('click')

    // then: repository url is opened
    expect(openUrlMock).toHaveBeenCalledWith(setting.getUrl())
  })

  it('opens issues url', async () => {
    const issues = new Issues(setting, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(() => issues)),
          [LogUseCaseKey as symbol]: mockedLogUseCase,
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        account: account,
        repositorySetting: setting,
        option: {}
      }
    })

    // when: click button
    await wrapper.find('.get-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: issue appears and issues url is opened
    await wrapper.find('div.clickable').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith('https://github.com/ytakahashi/miru/issues')
  })
})
