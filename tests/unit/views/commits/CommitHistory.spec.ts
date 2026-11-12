import type { Option } from '@/application/domain/interface/githubAccessor'
import {
  Account,
  Commit,
  CommitHistory as CommitHistoryModel,
  GitHubUrl,
  PageInfo,
} from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import {
  GetCommitHistoryUseCase,
  GetCommitHistoryUseCaseFactory,
} from '@/application/usecase/githubRepository'
import { WebBrowser } from '@/application/domain/interface/webBrowser'
import { GetCommitHistoryUseCaseFactoryKey, LoggerKey, WebBrowserKey } from '@/plugins/di/types'
import { getters, mutations } from '@/store/commits'
import { getters as queryOption } from '@/store/queryOption'
import CommitContent from '@/views/commits/CommitContent.vue'
import CommitHistory from '@/views/commits/CommitHistory.vue'
import { enableAutoUnmount, flushPromises, shallowMount } from '@vue/test-utils'
import { Mocked, vi } from 'vite-plus/test'
import { nextTick } from 'vue'
import { clickLoadMore, findLoadMoreFooter } from '../../helper/loadMoreFooter'

// GetCommitHistoryUseCase mock
const MockedGetCommitHistoryUseCase = vi.fn()
MockedGetCommitHistoryUseCase.mockImplementation(function MockedGetCommitHistoryUseCaseImpl(
  cb: () => CommitHistoryModel
): GetCommitHistoryUseCase {
  return {
    execute: async (): Promise<CommitHistoryModel> => cb(),
  }
})
const createMock = (func: () => GetCommitHistoryUseCase): GetCommitHistoryUseCaseFactory => {
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
const defaultOption: Option = { count: 5 }

const githubUrl = GitHubUrl.from('https://github.com')
const account = new Account('name', 'profile', 'avatar', githubUrl!, 'pat')
const setting = new RepositorySetting('https://github.com/ytakahashi/miru')

enableAutoUnmount(afterEach)

// The store is a module singleton shared by every test in this file.
beforeEach(() => {
  mutations.clear()
  mockedQueryOption.commits.mockReturnValue(defaultOption)
  loggerErrorMock.mockClear()
  openUrlMock.mockClear()
})

describe('CommitHistory.vue', () => {
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
      '2021-03-13T00:00:01Z'
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
      '2021-03-10T00:00:01Z'
    )
    const commitHistory = new CommitHistoryModel(setting, [commit1, commit2], 2)
    const wrapper = shallowMount(CommitHistory, {
      global: {
        provide: {
          [GetCommitHistoryUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetCommitHistoryUseCase(() => commitHistory)
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
    const err = new Error('cause')
    const supplier = () => {
      throw err
    }

    const wrapper = shallowMount(CommitHistory, {
      global: {
        provide: {
          [GetCommitHistoryUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetCommitHistoryUseCase(supplier)
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

    // when: click clear button
    await wrapper
      .find('.get-button')
      .trigger('click')
      .then(() => nextTick())

    // then: error mock is called
    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith(err)
  })

  it('opens commits url (repository name)', async () => {
    const commitHistory = new CommitHistoryModel(setting, [], 0)
    const wrapper = shallowMount(CommitHistory, {
      global: {
        provide: {
          [GetCommitHistoryUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetCommitHistoryUseCase(() => commitHistory)
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

    // then: commits url is opened
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith(
      'https://github.com/ytakahashi/miru/commits'
    )
  })
})

const commit = (url: string): Commit => new Commit(url, url, 0, 0, 0, 'author', '', 'committer', '')

const page = (urls: string[], cursor?: string): CommitHistoryModel =>
  new CommitHistoryModel(
    setting,
    urls.map(commit),
    3,
    new PageInfo(cursor !== undefined, cursor),
    defaultOption
  )

const mountList = (execute = vi.fn<GetCommitHistoryUseCase['execute']>()) => {
  const wrapper = shallowMount(CommitHistory, {
    global: {
      provide: {
        [GetCommitHistoryUseCaseFactoryKey as symbol]: createMock(() => ({ execute })),
        [WebBrowserKey as symbol]: mockedWebBrowser,
        [LoggerKey as symbol]: mockedLogger,
      },
    },
    props: { account, repositorySetting: setting },
  })
  return { wrapper, execute }
}

// Paging behavior itself is covered by usePagedList.spec.ts; these only verify the wiring.
describe('CommitHistory paging', () => {
  it('loads the next page with the saved conditions and appends it', async () => {
    mutations.replace(page(['first'], 'cursor-1'))
    // The next page must follow the conditions saved with the list, not the current query option.
    mockedQueryOption.commits.mockReturnValue({ count: 20 })
    const { wrapper, execute } = mountList()
    execute.mockResolvedValueOnce(page(['second']))
    expect(findLoadMoreFooter(wrapper).props()).toEqual({
      summary: 'showing 1 of 3 commits',
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
      wrapper.findAllComponents(CommitContent).map(item => item.props('commit').commitUrl)
    ).toEqual(['first', 'second'])
    expect(findLoadMoreFooter(wrapper).props()).toEqual({
      summary: 'showing 2 of 3 commits',
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
    expect(wrapper.text()).not.toContain('Failed to list commit history')
    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith(error)
  })
})
