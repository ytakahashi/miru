/* eslint-disable @typescript-eslint/no-unused-vars */

import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { Account, Commit, CommitHistory as CommitHistoryModel, GitHubUrl } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { GetCommitHistoryUseCase, GetCommitHistoryUseCaseFactory } from '@/application/usecase/githubRepository'
import { LogUseCase } from '@/application/usecase/log'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import { GetCommitHistoryUseCaseFactoryKey, LogUseCaseKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
import CommitContent from '@/views/commits/CommitContent.vue'
import CommitHistory from '@/views/commits/CommitHistory.vue'

// GetCommitHistoryUseCase mock
const MockedGetCommitHistoryUseCase = jest.fn<GetCommitHistoryUseCase, [() => CommitHistoryModel]>()
MockedGetCommitHistoryUseCase.mockImplementation((cb: () => CommitHistoryModel): GetCommitHistoryUseCase => {
  return {
    execute: async (): Promise<CommitHistoryModel> => cb()
  }
})
const createMock = (func: () => GetCommitHistoryUseCase): GetCommitHistoryUseCaseFactory => {
  return {
    create: (githubUrl: GitHubUrl, personalAccessToken: string) => func()
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

describe('CommitHistory.vue', () => {
  beforeEach(() => {
    errorMock.mockClear()
    openUrlMock.mockClear()
  })

  it('renders when 2 commits exist', async () => {
    const commit1 = new Commit(
      'commitMessage 1',
      'commitUrl 1',
      10,
      20,
      1,
      'ytakahashi',
      '2021-03-13T00:00:00Z',
      'ytakahashi',
      '2021-03-13T00:00:01Z',
      '2021-03-13T00:00:02Z'
    )
    const commit2 = new Commit(
      'commitMessage 2',
      'commitUrl 2',
      110,
      40,
      2,
      'ytakahashi',
      '2021-03-10T00:00:00Z',
      'ytakahashi',
      '2021-03-10T00:00:01Z',
      '2021-03-10T00:00:02Z'
    )
    const commitHistory = new CommitHistoryModel(setting, [commit1, commit2], 2)
    const wrapper = shallowMount(CommitHistory, {
      global: {
        provide: {
          [GetCommitHistoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGetCommitHistoryUseCase(() => commitHistory)),
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

    // then: commits appears
    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.find('.clear-button').exists()).toBe(true)
    expect(wrapper.findAllComponents(CommitContent)).toHaveLength(2)
    expect(openUrlMock).not.toHaveBeenCalled()

    // when: click clear button
    await wrapper.find('.clear-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: commits disappears
    expect(wrapper.findAllComponents(CommitContent)).toHaveLength(0)
    expect(openUrlMock).not.toHaveBeenCalled()
  })

  it('fails to get commits', async () => {
    const err = new Error('error')
    const supplier = () => {
      throw err
    }

    const wrapper = shallowMount(CommitHistory, {
      global: {
        provide: {
          [GetCommitHistoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGetCommitHistoryUseCase(supplier)),
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

  it('opens commits url (repository name)', async () => {
    const commitHistory = new CommitHistoryModel(setting, [], 0)
    const wrapper = shallowMount(CommitHistory, {
      global: {
        provide: {
          [GetCommitHistoryUseCaseFactoryKey as symbol]: createMock(() => new MockedGetCommitHistoryUseCase(() => commitHistory)),
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

    // then: commits url is opened
    expect(openUrlMock).toHaveBeenCalledWith('https://github.com/ytakahashi/miru/commits')
  })
})
