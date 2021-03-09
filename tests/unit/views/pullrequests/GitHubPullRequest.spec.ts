/* eslint-disable @typescript-eslint/no-unused-vars */

import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { Account, GitHubUrl, PullRequest, PullRequests, PullRequestReviews } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { GetPullRequestsUseCase, GetPullRequestsUseCaseFactory } from '@/application/usecase/githubRepository'
import { LogUseCase } from '@/application/usecase/log'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import { GetPullRequestsUseCaseFactoryKey, LogUseCaseKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
import GitHubPullRequest from '@/views/pullrequests/GitHubPullRequest.vue'
import PullRequestContent from '@/views/pullrequests/PullRequestContent.vue'

// GetPullRequestsUseCase mock
const MockedGetPullRequestsUseCase = jest.fn<GetPullRequestsUseCase, [() => PullRequests]>()
MockedGetPullRequestsUseCase.mockImplementation((cb: () => PullRequests): GetPullRequestsUseCase => {
  return {
    execute: async (): Promise<PullRequests> => cb()
  }
})
const createMock = (func: () => GetPullRequestsUseCase): GetPullRequestsUseCaseFactory => {
  return {
    create: (githubUrl: GitHubUrl, personalAccessToken: string) => func()
  }
}

// LogUseCase mock
const errorMock = jest.fn()
const MockedLogUseCase = jest.fn<LogUseCase, []>()
MockedLogUseCase.mockImplementation((): LogUseCase => {
  return {
    error: errorMock
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

describe('GitHubPullRequest.vue', () => {
  beforeEach(() => {
    errorMock.mockClear()
    openUrlMock.mockClear()
  })

  it('renders when open PR does not exist', async () => {
    const pullRequests = new PullRequests(setting, [], 0)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(() => new MockedGetPullRequestsUseCase(() => pullRequests)),
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
    expect(wrapper.text()).toContain('There aren’t any open pull requests.')
    expect(wrapper.findAllComponents(PullRequestContent)).toHaveLength(0)
  })

  it('renders when 2 open PRs exist', async () => {
    const pr1 = new PullRequest(
      'author 1',
      'pr title 1',
      'pr url 1',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [],
      2,
      3,
      123,
      456,
      7,
      false,
      new PullRequestReviews(15, false),
      false,
      false,
      false
    )
    const pr2 = new PullRequest(
      'author 2',
      'pr title 2',
      'pr url 2',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      124,
      [],
      2,
      3,
      234,
      567,
      8,
      false,
      new PullRequestReviews(5, false),
      false,
      false,
      false
    )
    const pullRequests = new PullRequests(setting, [pr1, pr2], 2)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(() => new MockedGetPullRequestsUseCase(() => pullRequests)),
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

    // then: pull requests appear
    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).toMatch(/Last fetched: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    expect(wrapper.text()).not.toContain('There aren’t any open pull requests.')
    expect(wrapper.text()).toContain('showing 2 of 2 pull requests')
    expect(wrapper.find('.clear-button').exists()).toBe(true)
    expect(wrapper.findAllComponents(PullRequestContent)).toHaveLength(2)
    expect(openUrlMock).not.toHaveBeenCalled()

    // when: click clear button
    await wrapper.find('.clear-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: pull requests disappears
    expect(wrapper.findAllComponents(PullRequestContent)).toHaveLength(0)
    expect(openUrlMock).not.toHaveBeenCalled()
  })

  it('fails to get PRs', async () => {
    const err = new Error('error')
    const supplier = () => {
      throw err
    }

    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(() => new MockedGetPullRequestsUseCase(supplier)),
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
    await wrapper.find('.get-button').trigger('click').then(() => nextTick())

    // then: error mock is called
    expect(errorMock).toHaveBeenCalledWith(err)
  })

  it('opens pull requests url (repository name)', async () => {
    const pullRequests = new PullRequests(setting, [], 0)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(() => new MockedGetPullRequestsUseCase(() => pullRequests)),
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

    // then: pr url is opened
    expect(openUrlMock).toHaveBeenCalledWith('https://github.com/ytakahashi/miru/pulls')
  })

  it('opens pull requests url (empty result)', async () => {
    const pullRequests = new PullRequests(setting, [], 0)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(() => new MockedGetPullRequestsUseCase(() => pullRequests)),
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

    // then: pr appears and pr url is opened
    await wrapper.find('div.clickable').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith('https://github.com/ytakahashi/miru/pulls')
  })
})
