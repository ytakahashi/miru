import { Account, GitHubUrl, Issue, Issues, PageInfo } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { GetIssuesUseCase, GetIssuesUseCaseFactory } from '@/application/usecase/githubRepository'
import type { Option } from '@/application/domain/interface/githubAccessor'
import { WebBrowser } from '@/application/domain/interface/webBrowser'
import LoadingImage from '@/components/LoadingImage.vue'
import { GetIssuesUseCaseFactoryKey, LoggerKey, WebBrowserKey } from '@/plugins/di/types'
import { getters, mutations } from '@/store/issues'
import { getters as queryOption } from '@/store/queryOption'
import GitHubIssue from '@/views/issues/GitHubIssue.vue'
import IssueContent from '@/views/issues/IssueContent.vue'
import { enableAutoUnmount, flushPromises, shallowMount } from '@vue/test-utils'
import { Mocked, vi } from 'vite-plus/test'
import { nextTick } from 'vue'

// GetIssuesUseCase mock
const MockedGetIssuesUseCase = vi.fn()
MockedGetIssuesUseCase.mockImplementation(function MockedGetIssuesUseCaseImpl(
  cb: () => Issues
): GetIssuesUseCase {
  return {
    execute: async (): Promise<Issues> => cb(),
  }
})
const createMock = (func: () => GetIssuesUseCase): GetIssuesUseCaseFactory => {
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

// queryOption mock
vi.mock('@/store/queryOption')
const mockedQueryOption = queryOption as Mocked<typeof queryOption>
const defaultOption: Option = {
  count: 10,
  sortField: 'UPDATED_AT',
  sortDirection: 'DESC',
  states: ['OPEN'],
}

const githubUrl = GitHubUrl.from('https://github.com')
const account = new Account('name', 'profile', 'avatar', githubUrl!, 'pat')
const setting = new RepositorySetting('https://github.com/ytakahashi/miru')

enableAutoUnmount(afterEach)

// The issues store is a module singleton shared by every test in this file.
beforeEach(() => {
  mutations.clear()
  mockedQueryOption.issues.mockReturnValue(defaultOption)
  loggerErrorMock.mockClear()
  openUrlMock.mockClear()
})

describe('GitHubIssue.vue', () => {
  it('renders when open issue does not exist', async () => {
    const issues = new Issues(setting, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GetIssuesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetIssuesUseCase(() => issues)
          ),
          [WebBrowserKey as symbol]: mockedWebBrowser,
          [LoggerKey as symbol]: mockedLogger,
        },
      },
      props: {
        account,
        repositorySetting: setting,
      },
    })

    // when: click button
    await wrapper.find('.get-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: message appears
    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).toContain("There aren't any open issues.")
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
      3,
      false,
      false,
      'OPEN'
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
      3,
      false,
      false,
      'OPEN'
    )
    const issues = new Issues(setting, [issue1, issue2], 2)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GetIssuesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetIssuesUseCase(() => issues)
          ),
          [WebBrowserKey as symbol]: mockedWebBrowser,
          [LoggerKey as symbol]: mockedLogger,
        },
      },
      props: {
        account,
        repositorySetting: setting,
      },
    })

    // when: click button
    await wrapper.find('.get-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: issues appears
    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).not.toContain('There aren’t any open issues.')
    expect(wrapper.find('.clear-button').exists()).toBe(true)
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(2)
    expect(wrapper.text()).toContain('showing 2 of 2 issues')
    expect(openUrlMock).not.toHaveBeenCalled()

    // when: click clear button
    await wrapper.find('.clear-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: issues disappears
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(0)
    expect(openUrlMock).not.toHaveBeenCalled()
  })

  it('fails to get issues', async () => {
    const err = new Error('cause')
    const supplier = () => {
      throw err
    }

    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GetIssuesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetIssuesUseCase(supplier)
          ),
          [WebBrowserKey as symbol]: mockedWebBrowser,
          [LoggerKey as symbol]: mockedLogger,
        },
      },
      props: {
        account,
        repositorySetting: setting,
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

  it('opens issues url (repository name)', async () => {
    const issues = new Issues(setting, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GetIssuesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetIssuesUseCase(() => issues)
          ),
          [WebBrowserKey as symbol]: mockedWebBrowser,
          [LoggerKey as symbol]: mockedLogger,
        },
      },
      props: {
        account,
        repositorySetting: setting,
      },
    })

    // when: click header text
    await wrapper.find('span.text-strong').trigger('click')

    // then: issue url is opened
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith('https://github.com/ytakahashi/miru/issues')
  })

  it('opens issues url (empty result)', async () => {
    const issues = new Issues(setting, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GetIssuesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetIssuesUseCase(() => issues)
          ),
          [WebBrowserKey as symbol]: mockedWebBrowser,
          [LoggerKey as symbol]: mockedLogger,
        },
      },
      props: {
        account,
        repositorySetting: setting,
      },
    })

    // when: click button
    await wrapper.find('.get-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: issue appears and issues url is opened
    await wrapper.find('div.clickable').trigger('click')
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith('https://github.com/ytakahashi/miru/issues')
  })
})

const issue = (url: string): Issue =>
  new Issue('author', url, url, '', '', 1, [], 0, 0, false, false, 'OPEN')

const page = (urls: string[], cursor?: string, option: Option = defaultOption): Issues =>
  new Issues(setting, urls.map(issue), 3, new PageInfo(cursor !== undefined, cursor), option)

const mountList = (execute = vi.fn<GetIssuesUseCase['execute']>()) => {
  const wrapper = shallowMount(GitHubIssue, {
    global: {
      provide: {
        [GetIssuesUseCaseFactoryKey as symbol]: createMock(() => ({ execute })),
        [WebBrowserKey as symbol]: mockedWebBrowser,
        [LoggerKey as symbol]: mockedLogger,
      },
    },
    props: { account, repositorySetting: setting },
  })
  return { wrapper, execute }
}

// Explicit completion keeps race tests independent of timers and network timing.
const deferred = () => {
  let resolve!: (issues: Issues) => void
  let reject!: (error: Error) => void
  const promise = new Promise<Issues>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

describe('GitHubIssue paging', () => {
  it('hides the footer before fetching', () => {
    const { wrapper } = mountList()
    expect(wrapper.find('.list-footer').exists()).toBe(false)
    expect(wrapper.find('.load-more-button').exists()).toBe(false)
  })

  it.each([
    ['no next page', new PageInfo(false)],
    ['no usable cursor', new PageInfo(true)],
  ])('hides Load more with %s even when totalCount exceeds the item count', (_, pageInfo) => {
    mutations.replace(new Issues(setting, [issue('first')], 10, pageInfo, defaultOption))
    const { wrapper } = mountList()
    expect(wrapper.text()).toContain('showing 1 of 10 issues')
    expect(wrapper.find('.load-more-button').exists()).toBe(false)
  })

  it('uses saved conditions, appends pages, and advances the cursor until the last page', async () => {
    mutations.replace(page(['first'], 'cursor-1'))
    mockedQueryOption.issues.mockReturnValue({ count: 20, states: ['CLOSED'] })
    const { wrapper, execute } = mountList()
    execute.mockResolvedValueOnce(page(['second'], 'cursor-2'))
    execute.mockResolvedValueOnce(page(['third']))

    expect(wrapper.find('.load-more-button').text()).toBe('Load more')
    await wrapper.find('.load-more-button').trigger('click')
    await flushPromises()

    expect(execute).toHaveBeenNthCalledWith(1, setting, {
      ...defaultOption,
      after: 'cursor-1',
    })
    expect(wrapper.findAllComponents(IssueContent).map(item => item.props('issue').url)).toEqual([
      'first',
      'second',
    ])
    expect(wrapper.text()).toContain('showing 2 of 3 issues')

    await wrapper.find('.load-more-button').trigger('click')
    await flushPromises()

    expect(execute).toHaveBeenNthCalledWith(2, setting, {
      ...defaultOption,
      after: 'cursor-2',
    })
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(3)
    expect(wrapper.text()).toContain('showing 3 of 3 issues')
    expect(wrapper.find('.load-more-button').exists()).toBe(false)
  })

  it('disables Load more, guards repeated calls, and leaves the mask hidden while pending', async () => {
    mutations.replace(page(['first'], 'cursor-1'))
    const pending = deferred()
    const { wrapper, execute } = mountList()
    execute.mockReturnValueOnce(pending.promise)

    await wrapper.find('.load-more-button').trigger('click')
    expect(wrapper.find('.load-more-button').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.load-more-button').text()).toBe('Loading…')
    expect(wrapper.findComponent(LoadingImage).props('loading')).toBe(false)
    await wrapper.vm.loadMore()
    expect(execute).toHaveBeenCalledTimes(1)

    pending.resolve(page(['second'], 'cursor-2'))
    await flushPromises()
    expect(wrapper.find('.load-more-button').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.load-more-button').text()).toBe('Load more')
  })

  it('ignores calls when no list or next page exists', async () => {
    const { wrapper, execute } = mountList()
    await wrapper.vm.loadMore()
    mutations.replace(page(['first']))
    await wrapper.vm.loadMore()
    expect(execute).not.toHaveBeenCalled()
  })

  it('keeps results and cursor after failure, then clears the error after a successful retry', async () => {
    const source = page(['first'], 'cursor-1')
    mutations.replace(source)
    const error = new Error('rate limit')
    const { wrapper, execute } = mountList()
    execute.mockRejectedValueOnce(error).mockResolvedValueOnce(page(['second']))

    await wrapper.find('.load-more-button').trigger('click')
    await flushPromises()

    expect(getters.of(setting)).toBe(source)
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(1)
    expect(wrapper.text()).toContain('rate limit')
    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith(error)
    expect(wrapper.find('.load-more-button').attributes('disabled')).toBeUndefined()

    await wrapper.find('.load-more-button').trigger('click')
    await flushPromises()

    expect(execute).toHaveBeenNthCalledWith(2, setting, { ...defaultOption, after: 'cursor-1' })
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Failed to list issues')
  })

  it.each(['replace', 'remove', 'clear'] as const)(
    'discards a successful response after %s without restoring old results',
    async action => {
      mutations.replace(page(['first'], 'cursor-1'))
      const pending = deferred()
      const { wrapper, execute } = mountList()
      execute.mockReturnValueOnce(pending.promise)
      await wrapper.find('.load-more-button').trigger('click')

      const replacement = page(['replacement'])
      if (action === 'replace') mutations.replace(replacement)
      else if (action === 'remove') mutations.remove(setting)
      else mutations.clear()
      pending.resolve(page(['stale']))
      await flushPromises()

      expect(getters.of(setting)).toBe(action === 'replace' ? replacement : undefined)
      expect(wrapper.text()).not.toContain('Failed to list issues')
      expect(loggerErrorMock).not.toHaveBeenCalled()
    }
  )

  it.each(['replace', 'remove', 'clear'] as const)(
    'ignores a failed response after %s',
    async action => {
      mutations.replace(page(['first'], 'cursor-1'))
      const pending = deferred()
      const { wrapper, execute } = mountList()
      execute.mockReturnValueOnce(pending.promise)
      await wrapper.find('.load-more-button').trigger('click')

      if (action === 'replace') mutations.replace(page(['replacement'], 'fresh-cursor'))
      else if (action === 'remove') mutations.remove(setting)
      else mutations.clear()
      pending.reject(new Error('stale failure'))
      await flushPromises()

      expect(wrapper.text()).not.toContain('Failed to list issues')
      expect(loggerErrorMock).not.toHaveBeenCalled()
      expect(wrapper.vm.loadingMore).toBe(false)
    }
  )

  it('refreshes with current query options and discards the older pending page', async () => {
    mutations.replace(page(['first'], 'cursor-1'))
    const pending = deferred()
    const { wrapper, execute } = mountList()
    const updatedOption: Option = { count: 20, states: ['CLOSED'] }
    const refreshed = page(['refreshed'], 'fresh-cursor', updatedOption)
    execute.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(refreshed)
    await wrapper.find('.load-more-button').trigger('click')

    mockedQueryOption.issues.mockReturnValue(updatedOption)
    await wrapper.find('.get-button').trigger('click')
    await flushPromises()
    expect(execute).toHaveBeenNthCalledWith(2, setting, updatedOption)
    expect(getters.of(setting)).toBe(refreshed)

    pending.resolve(page(['stale']))
    await flushPromises()
    expect(getters.of(setting)).toBe(refreshed)
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(1)
    expect(wrapper.findComponent(LoadingImage).props('loading')).toBe(false)
  })

  it('keeps the refresh mask when Load more fails during a refresh', async () => {
    mutations.replace(page(['first'], 'cursor-1'))
    const pendingMore = deferred()
    const pendingRefresh = deferred()
    const { wrapper, execute } = mountList()
    execute.mockReturnValueOnce(pendingMore.promise).mockReturnValueOnce(pendingRefresh.promise)
    await wrapper.find('.load-more-button').trigger('click')
    await wrapper.find('.get-button').trigger('click')

    const error = new Error('rate limit')
    pendingMore.reject(error)
    await flushPromises()

    expect(wrapper.text()).toContain('rate limit')
    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith(error)
    expect(wrapper.findComponent(LoadingImage).props('loading')).toBe(true)

    pendingRefresh.resolve(page(['refreshed']))
    await flushPromises()
    expect(wrapper.findComponent(LoadingImage).props('loading')).toBe(false)
    expect(wrapper.text()).not.toContain('Failed to list issues')
  })

  it('retains paging after remounting the view', () => {
    mutations.replace(page(['first'], 'cursor-1'))
    const { wrapper } = mountList()
    wrapper.unmount()
    const remounted = mountList().wrapper
    expect(remounted.find('.load-more-button').text()).toBe('Load more')
    expect(remounted.findAllComponents(IssueContent)).toHaveLength(1)
  })
})
