import type { Option } from '@/application/domain/interface/githubAccessor'
import { Account, GitHubUrl, PageInfo, Release, Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import {
  GetReleasesUseCase,
  GetReleasesUseCaseFactory,
} from '@/application/usecase/githubRepository'
import { WebBrowser } from '@/application/domain/interface/webBrowser'
import { GetReleasesUseCaseFactoryKey, LoggerKey, WebBrowserKey } from '@/plugins/di/types'
import { getters, mutations } from '@/store/releases'
import { getters as queryOption } from '@/store/queryOption'
import GitHubRelease from '@/views/releases/GitHubRelease.vue'
import ReleaseContent from '@/views/releases/ReleaseContent.vue'
import { enableAutoUnmount, flushPromises, shallowMount } from '@vue/test-utils'
import { Mocked, vi } from 'vite-plus/test'
import { nextTick } from 'vue'
import { clickLoadMore, findLoadMoreFooter } from '../../helper/loadMoreFooter'

// GetReleasesUseCase mock
const MockedGetReleasesUseCase = vi.fn()
MockedGetReleasesUseCase.mockImplementation(function MockedGetReleasesUseCaseImpl(
  cb: () => Releases
): GetReleasesUseCase {
  return {
    execute: async (): Promise<Releases> => cb(),
  }
})
const createMock = (func: () => GetReleasesUseCase): GetReleasesUseCaseFactory => {
  return {
    create: (_githubUrl: GitHubUrl, _personalAccessToken: string) => func(),
  }
}

// Logger mock
const loggerErrorMock = vi.fn()
const mockedLogger = {
  error: (e: Error) => loggerErrorMock(e),
  info: (_: string) => {},
  verbose: (_: string) => {},
}

// WebBrowser mock
const MockedWebBrowser = vi.fn()
const openUrlMock = vi.fn()
MockedWebBrowser.mockImplementation(function MockedWebBrowserImpl(): WebBrowser {
  return {
    openUrl: (url: string) => openUrlMock(url),
  }
})
const mockedWebBrowser = new MockedWebBrowser()

vi.mock('@/store/queryOption')
const mockedQueryOption = queryOption as Mocked<typeof queryOption>
const defaultOption: Option = { count: 3, sortField: 'CREATED_AT', sortDirection: 'DESC' }

const githubUrl = GitHubUrl.from('https://github.com')
const account = new Account('name', 'profile', 'avatar', githubUrl!, 'pat')
const setting = new RepositorySetting('https://github.com/ytakahashi/miru')

enableAutoUnmount(afterEach)

// The store is a module singleton shared by every test in this file.
beforeEach(() => {
  mutations.clear()
  mockedQueryOption.releases.mockReturnValue(defaultOption)
  loggerErrorMock.mockClear()
  openUrlMock.mockClear()
})

describe('GitHubRelease.vue', () => {
  it('renders when release does not exist', async () => {
    const releases = new Releases(setting, [], 0)
    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GetReleasesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetReleasesUseCase(() => releases)
          ),
          [WebBrowserKey as symbol]: mockedWebBrowser,
          [LoggerKey as symbol]: mockedLogger,
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
          [WebBrowserKey as symbol]: mockedWebBrowser,
          [LoggerKey as symbol]: mockedLogger,
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
    expect(findLoadMoreFooter(wrapper).props('summary')).toBe('showing 2 of 2 releases')
    expect(openUrlMock).not.toHaveBeenCalled()

    // when: click clear button
    await wrapper.find('.clear-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: releases disappears
    expect(wrapper.findAllComponents(ReleaseContent)).toHaveLength(0)
    expect(openUrlMock).not.toHaveBeenCalled()
  })

  it('fails to get releases', async () => {
    const err = new Error('cause')
    const supplier = () => {
      throw err
    }

    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GetReleasesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetReleasesUseCase(supplier)
          ),
          [WebBrowserKey as symbol]: mockedWebBrowser,
          [LoggerKey as symbol]: mockedLogger,
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
    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith(err)
  })

  it('opens release url (repository name)', async () => {
    const releases = new Releases(setting, [], 0)
    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GetReleasesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetReleasesUseCase(() => releases)
          ),
          [WebBrowserKey as symbol]: mockedWebBrowser,
          [LoggerKey as symbol]: mockedLogger,
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
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith(
      'https://github.com/ytakahashi/miru/releases'
    )
  })

  it('opens releases url (empty result)', async () => {
    const releases = new Releases(setting, [], 0)
    const wrapper = shallowMount(GitHubRelease, {
      global: {
        provide: {
          [GetReleasesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetReleasesUseCase(() => releases)
          ),
          [WebBrowserKey as symbol]: mockedWebBrowser,
          [LoggerKey as symbol]: mockedLogger,
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
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith(
      'https://github.com/ytakahashi/miru/releases'
    )
  })
})

const release = (url: string): Release => new Release('author', url, url, '', '', false, false, 0)

const page = (urls: string[], cursor?: string): Releases =>
  new Releases(
    setting,
    urls.map(release),
    3,
    new PageInfo(cursor !== undefined, cursor),
    defaultOption
  )

const mountList = (execute = vi.fn<GetReleasesUseCase['execute']>()) => {
  const wrapper = shallowMount(GitHubRelease, {
    global: {
      provide: {
        [GetReleasesUseCaseFactoryKey as symbol]: createMock(() => ({ execute })),
        [WebBrowserKey as symbol]: mockedWebBrowser,
        [LoggerKey as symbol]: mockedLogger,
      },
    },
    props: { account, repositorySetting: setting },
  })
  return { wrapper, execute }
}

// Paging behavior itself is covered by usePagedList.spec.ts; these only verify the wiring.
describe('GitHubRelease paging', () => {
  it('loads the next page with the saved conditions and appends it', async () => {
    mutations.replace(page(['first'], 'cursor-1'))
    // The next page must follow the conditions saved with the list, not the current query option.
    mockedQueryOption.releases.mockReturnValue({
      count: 20,
      sortField: 'NAME',
      sortDirection: 'ASC',
    })
    const { wrapper, execute } = mountList()
    execute.mockResolvedValueOnce(page(['second']))
    expect(findLoadMoreFooter(wrapper).props()).toEqual({
      summary: 'showing 1 of 3 releases',
      canLoadMore: true,
      loading: false,
      errorMessage: '',
    })

    await clickLoadMore(wrapper)

    expect(execute).toHaveBeenCalledExactlyOnceWith(setting, {
      ...defaultOption,
      after: 'cursor-1',
    })
    expect(
      wrapper.findAllComponents(ReleaseContent).map(item => item.props('release').url)
    ).toEqual(['first', 'second'])
    expect(findLoadMoreFooter(wrapper).props()).toEqual({
      summary: 'showing 2 of 3 releases',
      canLoadMore: false,
      loading: false,
      errorMessage: '',
    })
  })

  it('shows a Load more failure in the footer, not as a refresh failure', async () => {
    const source = page(['first'], 'cursor-1')
    mutations.replace(source)
    const error = new Error('rate limit')
    const { wrapper, execute } = mountList()
    execute.mockRejectedValueOnce(error)

    await clickLoadMore(wrapper)

    expect(getters.of(setting)).toBe(source)
    expect(findLoadMoreFooter(wrapper).props('errorMessage')).toBe('rate limit')
    expect(wrapper.text()).not.toContain('Failed to list releases')
    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith(error)
  })
})
