import { Label, PullRequest, PullRequestReviews } from '@/application/domain/model/github'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'
import PullRequestContent from '@/views/pullrequests/PullRequestContent.vue'
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

describe('PullRequestContent.vue', () => {
  beforeEach(() => {
    openUrlMock.mockClear()
  })

  it('renders pull request (assigned)', async () => {
    const pr = new PullRequest(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      12,
      23,
      4,
      false,
      new PullRequestReviews(20, true),
      true,
      false,
      false,
      'OPEN'
    )

    const wrapper = shallowMount(PullRequestContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        pullRequest: pr,
      },
    })

    expect(wrapper.classes()).to.contain('content-box-open')
    expect(wrapper.classes()).not.to.contain('content-box-pr-draft')
    expect(wrapper.classes()).not.to.contain('content-box-pr-closed')
    expect(wrapper.classes()).not.to.contain('content-box-pr-merged')
    expect(wrapper.find('i.fa-check-circle').exists()).toBe(false)
    expect(wrapper.find('i.fa-ban').exists()).toBe(false)
    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).not.toContain('My PR')
    expect(wrapper.text()).toContain('Assigned')
    expect(wrapper.text()).not.toContain('Review Requested')
    expect(wrapper.find('span.draft-mark').exists()).toBe(false)
    const tooltips = wrapper.find('div.pr-description').findAll('span.tooltip')
    expect(tooltips).toHaveLength(2)
    expect(tooltips[1].text()).toBe('22+')
    expect(tooltips[1].attributes('data-tooltip')).toBe('2 comments, 20+ reviews')
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('renders pull request (review requested)', async () => {
    const pr = new PullRequest(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      12,
      23,
      4,
      false,
      new PullRequestReviews(20, true),
      false,
      true,
      false,
      'OPEN'
    )

    const wrapper = shallowMount(PullRequestContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        pullRequest: pr,
      },
    })

    expect(wrapper.classes()).to.contain('content-box-open')
    expect(wrapper.classes()).not.to.contain('content-box-pr-draft')
    expect(wrapper.classes()).not.to.contain('content-box-pr-closed')
    expect(wrapper.classes()).not.to.contain('content-box-pr-merged')
    expect(wrapper.find('i.fa-check-circle').exists()).toBe(false)
    expect(wrapper.find('i.fa-ban').exists()).toBe(false)
    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).not.toContain('My PR')
    expect(wrapper.text()).not.toContain('Assigned')
    expect(wrapper.text()).toContain('Review Requested')
    expect(wrapper.find('span.draft-mark').exists()).toBe(false)
    const tooltips = wrapper.find('div.pr-description').findAll('span.tooltip')
    expect(tooltips).toHaveLength(2)
    expect(tooltips[1].text()).toBe('22+')
    expect(tooltips[1].attributes('data-tooltip')).toBe('2 comments, 20+ reviews')
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('renders draft pull request (opened)', async () => {
    const draftPr = new PullRequest(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      12,
      23,
      4,
      true,
      new PullRequestReviews(10, false),
      false,
      false,
      true,
      'OPEN'
    )

    const wrapper = shallowMount(PullRequestContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        pullRequest: draftPr,
      },
    })

    expect(wrapper.classes()).not.to.contain('content-box-open')
    expect(wrapper.classes()).to.contain('content-box-pr-draft')
    expect(wrapper.classes()).not.to.contain('content-box-pr-closed')
    expect(wrapper.classes()).not.to.contain('content-box-pr-merged')
    expect(wrapper.find('i.fa-check-circle').exists()).toBe(false)
    expect(wrapper.find('i.fa-ban').exists()).toBe(false)
    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain('My PR')
    expect(wrapper.text()).not.toContain('Assigned')
    expect(wrapper.text()).not.toContain('Review Requested')
    const tooltips = wrapper.find('div.pr-description').findAll('span.tooltip')
    expect(tooltips).toHaveLength(2)
    expect(tooltips[1].text()).toBe('12')
    expect(tooltips[1].attributes('data-tooltip')).toBe('2 comments, 10 reviews')
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('renders draft pull request (closed)', async () => {
    const draftPr = new PullRequest(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      12,
      23,
      4,
      true,
      new PullRequestReviews(10, false),
      false,
      false,
      true,
      'CLOSED'
    )

    const wrapper = shallowMount(PullRequestContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        pullRequest: draftPr,
      },
    })

    expect(wrapper.classes()).not.to.contain('content-box-open')
    expect(wrapper.classes()).not.to.contain('content-box-pr-draft')
    expect(wrapper.classes()).to.contain('content-box-pr-closed')
    expect(wrapper.classes()).not.to.contain('content-box-pr-merged')
    expect(wrapper.find('i.fa-check-circle').exists()).toBe(false)
    expect(wrapper.find('i.fa-ban').exists()).toBe(true)
    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain('My PR')
    expect(wrapper.text()).not.toContain('Assigned')
    expect(wrapper.text()).not.toContain('Review Requested')
    const tooltips = wrapper.find('div.pr-description').findAll('span.tooltip')
    expect(tooltips).toHaveLength(2)
    expect(tooltips[1].text()).toBe('12')
    expect(tooltips[1].attributes('data-tooltip')).toBe('2 comments, 10 reviews')
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('renders draft pull request (merged)', async () => {
    const draftPr = new PullRequest(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      12,
      23,
      4,
      true,
      new PullRequestReviews(10, false),
      false,
      false,
      true,
      'MERGED'
    )

    const wrapper = shallowMount(PullRequestContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        pullRequest: draftPr,
      },
    })

    expect(wrapper.classes()).not.to.contain('content-box-open')
    expect(wrapper.classes()).not.to.contain('content-box-pr-draft')
    expect(wrapper.classes()).not.to.contain('content-box-pr-closed')
    expect(wrapper.classes()).to.contain('content-box-pr-merged')
    expect(wrapper.find('i.fa-check-circle').exists()).toBe(true)
    expect(wrapper.find('i.fa-ban').exists()).toBe(false)
    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain('My PR')
    expect(wrapper.text()).not.toContain('Assigned')
    expect(wrapper.text()).not.toContain('Review Requested')
    const tooltips = wrapper.find('div.pr-description').findAll('span.tooltip')
    expect(tooltips).toHaveLength(2)
    expect(tooltips[1].text()).toBe('12')
    expect(tooltips[1].attributes('data-tooltip')).toBe('2 comments, 10 reviews')
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('can open url', async () => {
    const pr = new PullRequest(
      author,
      title,
      url,
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [label1, label2],
      2,
      3,
      12,
      23,
      4,
      false,
      new PullRequestReviews(20, true),
      false,
      false,
      false,
      'OPEN'
    )

    const wrapper = shallowMount(PullRequestContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUseCase,
        },
      },
      props: {
        pullRequest: pr,
      },
    })

    await wrapper.find('div.content-box-open').trigger('click')
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith(url)
  })
})
