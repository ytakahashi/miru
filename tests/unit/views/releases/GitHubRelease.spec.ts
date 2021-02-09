/* eslint-disable @typescript-eslint/no-unused-vars */

import { shallowMount } from '@vue/test-utils'
import { GitHubRepositoryUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
import { Account, GitHubUrl, Issues, PullRequests, Release, Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { GitHubRepositoryUseCase, GitHubRepositoryUseCaseFactory } from '@/application/usecase/githubRepository'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import GitHubRelease from '@/views/releases/GitHubRelease.vue'
import ReleaseContent from '@/views/releases/ReleaseContent.vue'

const MockedGitHubRepositoryUseCase = jest.fn<GitHubRepositoryUseCase, [Releases]>()
MockedGitHubRepositoryUseCase.mockImplementation((releases: Releases): GitHubRepositoryUseCase => {
  return {
    getIssues: async (): Promise<Issues> => jest.fn<Issues, []>()(),
    getPullRequests: async (): Promise<PullRequests> => jest.fn<PullRequests, []>()(),
    getReleases: async (): Promise<Releases> => releases
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

describe('GitHubRelease.vue', () => {
  beforeEach(() => {
    openUrlMock.mockClear()
  })

  it('renders when release does not exist', async () => {
    const releases = new Releases(setting, [], 0)
    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(releases)),
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
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: message appears
    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).toContain('There aren’t any releases.')
    expect(wrapper.text()).toMatch(/Last fetched: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    expect(wrapper.findAllComponents(ReleaseContent)).toHaveLength(0)
    expect(openUrlMock).not.toHaveBeenCalled()
  })

  it('renders when 2 releases exist', async () => {
    const release1 = new Release(
      'author 1',
      'issue title 1',
      'issue url 1',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      false,
      false,
      3
    )
    const release2 = new Release(
      'author 2',
      'issue title 2',
      'issue url 2',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      false,
      false,
      0
    )
    const releases = new Releases(setting, [release1, release2], 2)
    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(releases)),
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
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: releases appear
    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).toMatch(/Last fetched: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    expect(wrapper.text()).not.toContain('There aren’t any open issues.')
    expect(wrapper.find('.clear-button').exists()).toBe(true)
    expect(wrapper.findAllComponents(ReleaseContent)).toHaveLength(2)
    expect(openUrlMock).not.toHaveBeenCalled()

    // when: click clear button
    await wrapper.find('.clear-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: releases disappears
    expect(wrapper.findAllComponents(ReleaseContent)).toHaveLength(0)
    expect(openUrlMock).not.toHaveBeenCalled()
  })

  it('opens repository url', async () => {
    const releases = new Releases(setting, [], 0)
    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(releases)),
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

  it('opens releases url', async () => {
    const releases = new Releases(setting, [], 0)
    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GitHubRepositoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGitHubRepositoryUseCase(releases)),
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
    await wrapper.find('.app-input-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: release appears and release url is opened
    await wrapper.find('div.clickable').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith('https://github.com/ytakahashi/miru/releases')
  })
})
