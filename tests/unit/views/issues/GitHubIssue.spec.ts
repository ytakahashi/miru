import { Account, GitHubUrl, Issue, Issues } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { GetIssuesUseCase, GetIssuesUseCaseFactory } from '@/application/usecase/githubRepository'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import { GetIssuesUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/plugins/di/types'
import { getters as queryOption } from '@/store/queryOption'
import GitHubIssue from '@/views/issues/GitHubIssue.vue'
import IssueContent from '@/views/issues/IssueContent.vue'
import { shallowMount } from '@vue/test-utils'
import { Mocked, vi } from 'vitest'
import { nextTick } from 'vue'

// GetIssuesUseCase mock
const MockedGetIssuesUseCase = vi.fn()
MockedGetIssuesUseCase.mockImplementation((cb: () => Issues): GetIssuesUseCase => {
  return {
    execute: async (): Promise<Issues> => cb(),
  }
})
const createMock = (func: () => GetIssuesUseCase): GetIssuesUseCaseFactory => {
  return {
    create: (_githubUrl: GitHubUrl, _personalAccessToken: string) => func(),
  }
}

// logger mock
const loggerErrorMock = vi.fn()
vi.mock('@/application/core/logger', () => ({
  logger: {
    error: (e: Error) => loggerErrorMock(e),
    info: (_: string) => {},
    verbose: (_: string) => {},
  },
}))

// WebBrowserUserCase mock
const MockedWebBrowserUserCase = vi.fn()
const openUrlMock = vi.fn()
MockedWebBrowserUserCase.mockImplementation((): WebBrowserUserCase => {
  return {
    openUrl: (url: string) => openUrlMock(url),
  }
})
const mockedWebBrowserUserCase = new MockedWebBrowserUserCase()

// queryOption mock
vi.mock('@/store/queryOption')
const mockedQueryOption = queryOption as Mocked<typeof queryOption>
mockedQueryOption.issues.mockReturnValue({
  count: 10,
  sortField: 'UPDATED_AT',
  sortDirection: 'DESC',
  states: ['OPEN'],
})

const githubUrl = GitHubUrl.from('https://github.com')
const account = new Account('name', 'profile', 'avatar', githubUrl!, 'pat')
const setting = new RepositorySetting('https://github.com/ytakahashi/miru')
setting.setCategory('category1')

describe('GitHubIssue.vue', () => {
  beforeEach(() => {
    loggerErrorMock.mockClear()
    openUrlMock.mockClear()
  })

  it('renders when open issue does not exist', async () => {
    const issues = new Issues(setting, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      global: {
        provide: {
          [GetIssuesUseCaseFactoryKey as symbol]: createMock(
            () => new MockedGetIssuesUseCase(() => issues)
          ),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        fetchTrigger: '',
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
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        fetchTrigger: '',
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

  it('renders when fetchTrigger is updated', async () => {
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
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        fetchTrigger: '',
      },
    })

    // when: fetchTrigger unmatches
    await wrapper.setProps({ fetchTrigger: 'categoryX' })
    await wrapper.vm.$nextTick()

    // then: issues don't appear
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(0)

    // when: fetchTrigger matches
    await wrapper.setProps({ fetchTrigger: 'category1' })
    await wrapper.vm.$nextTick()

    // then: issues appear
    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).not.toContain('There aren’t any open issues.')
    expect(wrapper.find('.clear-button').exists()).toBe(true)
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(2)
    expect(wrapper.text()).toContain('showing 2 of 2 issues')
    expect(openUrlMock).not.toHaveBeenCalled()

    // when: click clear button
    await wrapper.find('.clear-button').trigger('click')
    await wrapper.vm.$nextTick()

    // then: issues disappear
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
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        fetchTrigger: '',
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
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        fetchTrigger: '',
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
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        account,
        repositorySetting: setting,
        fetchTrigger: '',
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
