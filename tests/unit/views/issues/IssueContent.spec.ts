import { Issue, Label } from '@/application/domain/model/github'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'
import IssueContent from '@/views/issues/IssueContent.vue'
import { shallowMount } from '@vue/test-utils'
import { vi } from 'vitest'

const MockedWebBrowserUseCase = vi.fn()
const openUrlMock = vi.fn()
MockedWebBrowserUseCase.mockImplementation((): WebBrowserUserCase => {
  return {
    openUrl: (url: string) => openUrlMock(url),
  }
})
const mockedWebBrowserUseCase = new MockedWebBrowserUseCase()

const author = 'ytakahashi'
const title = 'issue title'
const url = 'https://github.com/ytakahashi/miru'
const label1 = new Label('label-1', 'a9ff6d')
const label2 = new Label('label-2', '6d78ff')

describe('IssueContent.vue', () => {
  beforeEach(() => {
    openUrlMock.mockClear()
  })

  it('renders issue (opened / my issue)', async () => {
    const issue = new Issue(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      false,
      true,
      'OPEN'
    )

    const wrapper = shallowMount(IssueContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        issue,
      },
    })

    expect(wrapper.classes()).to.contain('content-box-open')
    expect(wrapper.classes()).not.to.contain('content-box-closed')
    expect(wrapper.find('i.fa-check-circle').exists()).toBe(false)
    expect(wrapper.find('i.fa-ban').exists()).toBe(false)
    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain('My Issue')
    expect(wrapper.text()).not.toContain('Assigned')
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('renders issue (opened / assigned)', async () => {
    const issue = new Issue(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      true,
      false,
      'OPEN'
    )

    const wrapper = shallowMount(IssueContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        issue,
      },
    })

    expect(wrapper.classes()).to.contain('content-box-open')
    expect(wrapper.classes()).not.to.contain('content-box-closed')
    expect(wrapper.find('i.fa-check-circle').exists()).toBe(false)
    expect(wrapper.find('i.fa-ban').exists()).toBe(false)
    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).not.toContain('My Issue')
    expect(wrapper.text()).toContain('Assigned')
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('renders issue (closed/completed)', async () => {
    const issue = new Issue(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      true,
      false,
      'CLOSED',
      'COMPLETED'
    )

    const wrapper = shallowMount(IssueContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        issue,
      },
    })

    expect(wrapper.classes()).not.to.contain('content-box-open')
    expect(wrapper.classes()).not.to.contain('content-box-closed-not_planned')
    expect(wrapper.classes()).to.contain('content-box-closed-completed')
    expect(wrapper.find('i.fa-check-circle').exists()).toBe(true)
    expect(wrapper.find('i.fa-ban').exists()).toBe(false)
    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).not.toContain('My Issue')
    expect(wrapper.text()).toContain('Assigned')
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('renders issue (closed/npt planned)', async () => {
    const issue = new Issue(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      true,
      false,
      'CLOSED',
      'NOT_PLANNED'
    )

    const wrapper = shallowMount(IssueContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        issue,
      },
    })

    expect(wrapper.classes()).not.to.contain('content-box-open')
    expect(wrapper.classes()).to.contain('content-box-closed-not_planned')
    expect(wrapper.classes()).not.to.contain('content-box-closed-completed')
    expect(wrapper.find('i.fa-check-circle').exists()).toBe(false)
    expect(wrapper.find('i.fa-ban').exists()).toBe(true)
    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).not.toContain('My Issue')
    expect(wrapper.text()).toContain('Assigned')
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('can open url', async () => {
    const issue = new Issue(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      false,
      true,
      'OPEN'
    )

    const wrapper = shallowMount(IssueContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        issue,
      },
    })

    await wrapper.find('div.content-box-open').trigger('click')
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith(url)
  })
})
