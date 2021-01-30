/* eslint-disable @typescript-eslint/no-unused-vars */

import { shallowMount } from '@vue/test-utils'
import PullRequestContent from '@/components/PullRequestContent.vue'
import { WebBrowserUserCaseKey } from '@/di/types'
import { PullRequest, Label } from '@/application/domain/model/github'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'

const MockedWebBrowserUserCase = jest.fn<WebBrowserUserCase, []>()
const openUrlMock = jest.fn()
MockedWebBrowserUserCase.mockImplementation((): WebBrowserUserCase => {
  return {
    openUrl: (url: string) => openUrlMock(url)
  }
})
const mockedWebBrowserUserCase = new MockedWebBrowserUserCase()

const author = 'ytakahashi'
const title = 'issue title'
const url = 'https://github.com/ytakahashi/miru'
const label1 = new Label('label-1', 'a9ff6d')
const label2 = new Label('label-2', '6d78ff')
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
  false
)

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
  true
)

describe('IssueContent.vue', () => {
  beforeEach(() => {
    openUrlMock.mockClear()
  })

  it('renders pull request', async () => {
    const wrapper = shallowMount(PullRequestContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        pullRequest: pr
      }
    })

    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.find('span.draft-mark').exists()).toBe(false)
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('renders draft pull request', async () => {
    const wrapper = shallowMount(PullRequestContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        pullRequest: draftPr
      }
    })

    expect(wrapper.text()).toMatch(/ytakahashi opened .+ .+ ago/)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.find('span.draft-mark').exists()).toBe(true)
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('can open url', async () => {
    const wrapper = shallowMount(PullRequestContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        pullRequest: pr
      }
    })

    await wrapper.find('div.content-box-open').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith(url)
  })
})
