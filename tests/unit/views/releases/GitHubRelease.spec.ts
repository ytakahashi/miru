import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { vi } from 'vitest'
import { Account, GitHubUrl, Release, Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import {
  GetReleasesUseCase,
  GetReleasesUseCaseFactory,
} from '@/application/usecase/githubRepository'
import { LogUseCase } from '@/application/usecase/log'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import {
  GetReleasesUseCaseFactoryKey,
  LogUseCaseKey,
  WebBrowserUserCaseKey,
} from '@/plugins/di/types'
import GitHubRelease from '@/views/releases/GitHubRelease.vue'
import ReleaseContent from '@/views/releases/ReleaseContent.vue'

// GetReleasesUseCase mock
const MockedGetReleasesUseCase = vi.fn()
MockedGetReleasesUseCase.mockImplementation((cb: () => Releases): GetReleasesUseCase => {
  return {
    execute: async (): Promise<Releases> => cb(),
  }
})
const createMock = (func: () => GetReleasesUseCase): GetReleasesUseCaseFactory => {
  return {
    create: (_githubUrl: GitHubUrl, _personalAccessToken: string) => func(),
  }
}

// LogUseCase mock
const errorMock = vi.fn()
const MockedLogUseCase = vi.fn()
MockedLogUseCase.mockImplementation((): LogUseCase => {
  return {
    error: errorMock,
  }
})
const mockedLogUseCase = new MockedLogUseCase()

// WebBrowserUserCase mock
const MockedWebBrowserUserCase = vi.fn()
const openUrlMock = vi.fn()
MockedWebBrowserUserCase.mockImplementation((): WebBrowserUserCase => {
  return {
    openUrl: (url: string) => openUrlMock(url),
  }
})
const mockedWebBrowserUserCase = new MockedWebBrowserUserCase()

const githubUrl = GitHubUrl.from('https://github.com')
const account = new Account('name', 'profile', 'avatar', githubUrl!, 'pat')
const setting = new RepositorySetting('https://github.com/ytakahashi/miru')

describe('GitHubRelease.vue', () => {
  beforeEach(() => {
    errorMock.mockClear()
    openUrlMock.mockClear()
  })

  it('renders when release does not exist', async () => {
    const releases = new Releases(setting, [], 0)
    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GetReleasesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetReleasesUseCase(() => releases)
          ),
          [LogUseCaseKey as symbol]: mockedLogUseCase,
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        option: {},
      },
    })

    // when: click button
    await wrapper.find('button.get-button').trigger('click')
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
          [GetReleasesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetReleasesUseCase(() => releases)
          ),
          [LogUseCaseKey as symbol]: mockedLogUseCase,
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        option: {},
      },
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
    expect(wrapper.text()).toContain('showing 2 of 2 releases')
    expect(openUrlMock).not.toHaveBeenCalled()

    // when: click clear button
    await wrapper.find('.clear-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: releases disappears
    expect(wrapper.findAllComponents(ReleaseContent)).toHaveLength(0)
    expect(openUrlMock).not.toHaveBeenCalled()
  })

  it('fails to get releases', async () => {
    const err = new Error('error')
    const supplier = () => {
      throw err
    }

    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GetReleasesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetReleasesUseCase(supplier)
          ),
          [LogUseCaseKey as symbol]: mockedLogUseCase,
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        option: {},
      },
    })

    // when: click button
    await wrapper
      .find('button.get-button')
      .trigger('click')
      .then(() => nextTick())

    // then: error mock is called
    expect(errorMock).toHaveBeenCalledWith(err)
  })

  it('opens release url (repository name)', async () => {
    const releases = new Releases(setting, [], 0)
    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GetReleasesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetReleasesUseCase(() => releases)
          ),
          [LogUseCaseKey as symbol]: mockedLogUseCase,
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        option: {},
      },
    })

    // when: click header text
    await wrapper.find('span.text-strong').trigger('click')

    // then: release url is opened
    expect(openUrlMock).toHaveBeenCalledWith('https://github.com/ytakahashi/miru/releases')
  })

  it('opens releases url (empty result)', async () => {
    const releases = new Releases(setting, [], 0)
    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GetReleasesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetReleasesUseCase(() => releases)
          ),
          [LogUseCaseKey as symbol]: mockedLogUseCase,
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        option: {},
      },
    })

    // when: click button
    await wrapper.find('.get-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: release appears and release url is opened
    await wrapper.find('div.clickable').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith('https://github.com/ytakahashi/miru/releases')
  })
})
