import type { Option } from '@/application/domain/interface/githubAccessor'
import {
  Account,
  GitHubUrl,
  PageInfo,
  PullRequest,
  PullRequestReviews,
  PullRequests,
} from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import {
  GetPullRequestsUseCase,
  GetPullRequestsUseCaseFactory,
} from '@/application/usecase/githubRepository'
import { WebBrowser } from '@/application/domain/interface/webBrowser'
import { GetPullRequestsUseCaseFactoryKey, LoggerKey, WebBrowserKey } from '@/plugins/di/types'
import { getters, mutations } from '@/store/pullRequests'
import { getters as queryOption } from '@/store/queryOption'
import GitHubPullRequest from '@/views/pullrequests/GitHubPullRequest.vue'
import PullRequestContent from '@/views/pullrequests/PullRequestContent.vue'
import { enableAutoUnmount, flushPromises, shallowMount } from '@vue/test-utils'
import { Mocked, vi } from 'vite-plus/test'
import { nextTick } from 'vue'
import { clickLoadMore, findLoadMoreFooter } from '../../helper/loadMoreFooter'

// GetPullRequestsUseCase mock
const MockedGetPullRequestsUseCase = vi.fn()
MockedGetPullRequestsUseCase.mockImplementation(function MockedGetPullRequestsUseCaseImpl(
  cb: () => PullRequests
): GetPullRequestsUseCase {
  return {
    execute: async (): Promise<PullRequests> => cb(),
  }
})
const createMock = (func: () => GetPullRequestsUseCase): GetPullRequestsUseCaseFactory => {
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

// The store is a module singleton shared by every test in this file.
beforeEach(() => {
  mutations.clear()
  mockedQueryOption.pullRequests.mockReturnValue(defaultOption)
  loggerErrorMock.mockClear()
  openUrlMock.mockClear()
})

describe('GitHubPullRequest.vue', () => {
  it('renders when open PR does not exist', async () => {
    const pullRequests = new PullRequests(setting, [], 0)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetPullRequestsUseCase(() => pullRequests)
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
    expect(wrapper.text()).toContain("There aren't any open pull requests.")
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
      false,
      'OPEN'
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
      false,
      'OPEN'
    )
    const pullRequests = new PullRequests(setting, [pr1, pr2], 2)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetPullRequestsUseCase(() => pullRequests)
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

    // then: pull requests appear
    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).toMatch(/Last fetched: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    expect(wrapper.text()).not.toContain('There aren’t any open pull requests.')
    expect(findLoadMoreFooter(wrapper).props('summary')).toBe('showing 2 of 2 pull requests')
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
    const err = new Error('cause')
    const supplier = () => {
      throw err
    }

    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetPullRequestsUseCase(supplier)
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
    await wrapper
      .find('.get-button')
      .trigger('click')
      .then(() => nextTick())

    // then: error mock is called
    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith(err)
  })

  it('opens pull requests url (repository name)', async () => {
    const pullRequests = new PullRequests(setting, [], 0)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetPullRequestsUseCase(() => pullRequests)
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

    // then: pr url is opened
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith('https://github.com/ytakahashi/miru/pulls')
  })

  it('opens pull requests url (empty result)', async () => {
    const pullRequests = new PullRequests(setting, [], 0)
    const wrapper = shallowMount(GitHubPullRequest, {
      global: {
        provide: {
          [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetPullRequestsUseCase(() => pullRequests)
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

    // then: pr appears and pr url is opened
    await wrapper.find('div.clickable').trigger('click')
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith('https://github.com/ytakahashi/miru/pulls')
  })
})

const pullRequest = (url: string): PullRequest =>
  new PullRequest(
    'author',
    url,
    url,
    '',
    '',
    1,
    [],
    0,
    0,
    0,
    0,
    0,
    false,
    new PullRequestReviews(0, false),
    false,
    false,
    false,
    'OPEN'
  )

const page = (urls: string[], cursor?: string): PullRequests =>
  new PullRequests(
    setting,
    urls.map(pullRequest),
    3,
    new PageInfo(cursor !== undefined, cursor),
    defaultOption
  )

const mountList = (execute = vi.fn<GetPullRequestsUseCase['execute']>()) => {
  const wrapper = shallowMount(GitHubPullRequest, {
    global: {
      provide: {
        [GetPullRequestsUseCaseFactoryKey as symbol]: createMock(() => ({ execute })),
        [WebBrowserKey as symbol]: mockedWebBrowser,
        [LoggerKey as symbol]: mockedLogger,
      },
    },
    props: { account, repositorySetting: setting },
  })
  return { wrapper, execute }
}

// Paging behavior itself is covered by usePagedList.spec.ts; these only verify the wiring.
describe('GitHubPullRequest paging', () => {
  it('loads the next page with the saved conditions and appends it', async () => {
    mutations.replace(page(['first'], 'cursor-1'))
    // The next page must follow the conditions saved with the list, not the current query option.
    mockedQueryOption.pullRequests.mockReturnValue({ count: 20, states: ['CLOSED'] })
    const { wrapper, execute } = mountList()
    execute.mockResolvedValueOnce(page(['second']))
    expect(findLoadMoreFooter(wrapper).props()).toEqual({
      summary: 'showing 1 of 3 pull requests',
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
      wrapper.findAllComponents(PullRequestContent).map(item => item.props('pullRequest').url)
    ).toEqual(['first', 'second'])
    expect(findLoadMoreFooter(wrapper).props()).toEqual({
      summary: 'showing 2 of 3 pull requests',
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
    expect(wrapper.text()).not.toContain('Failed to list pull requests')
    expect(loggerErrorMock).toHaveBeenCalledExactlyOnceWith(error)
  })
})
