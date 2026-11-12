import { Account, GitHubUrl, Issue, Issues, PageInfo } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { GetIssuesUseCase, GetIssuesUseCaseFactory } from '@/application/usecase/githubRepository'
import type { Option } from '@/application/domain/interface/githubAccessor'
import { WebBrowser } from '@/application/domain/interface/webBrowser'
import { GetIssuesUseCaseFactoryKey, LoggerKey, WebBrowserKey } from '@/plugins/di/types'
import { getters, mutations } from '@/store/issues'
import { getters as queryOption } from '@/store/queryOption'
import GitHubIssue from '@/views/issues/GitHubIssue.vue'
import IssueContent from '@/views/issues/IssueContent.vue'
import { enableAutoUnmount, flushPromises, shallowMount } from '@vue/test-utils'
import { Mocked, vi } from 'vite-plus/test'
import { nextTick } from 'vue'
import { clickLoadMore, findLoadMoreFooter } from '../../helper/loadMoreFooter'

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
    expect(findLoadMoreFooter(wrapper).props('summary')).toBe('showing 2 of 2 issues')
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

const page = (urls: string[], cursor?: string): Issues =>
  new Issues(setting, urls.map(issue), 3, new PageInfo(cursor !== undefined, cursor), defaultOption)

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

// Paging behavior itself is covered by usePagedList.spec.ts; these only verify the wiring.
describe('GitHubIssue paging', () => {
  it('loads the next page with the saved conditions and appends it', async () => {
    mutations.replace(page(['first'], 'cursor-1'))
    // The next page must follow the conditions saved with the list, not the current query option.
    mockedQueryOption.issues.mockReturnValue({ count: 20, states: ['CLOSED'] })
    const { wrapper, execute } = mountList()
    execute.mockResolvedValueOnce(page(['second']))
    expect(findLoadMoreFooter(wrapper).props()).toEqual({
      summary: 'showing 1 of 3 issues',
      canLoadMore: true,
      loading: false,
      errorMessage: '',
    })

    await clickLoadMore(wrapper)

    expect(execute).toHaveBeenCalledExactlyOnceWith(setting, {
      ...defaultOption,
      after: 'cursor-1',
    })
    expect(wrapper.findAllComponents(IssueContent).map(item => item.props('issue').url)).toEqual([
      'first',
      'second',
    ])
    expect(findLoadMoreFooter(wrapper).props()).toEqual({
      summary: 'showing 2 of 3 issues',
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
    expect(wrapper.text()).not.toContain('Failed to list issues')
    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith(error)
  })
})
