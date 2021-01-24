/* eslint-disable @typescript-eslint/no-unused-vars */

import { shallowMount } from '@vue/test-utils'
import IssueContent from '@/components/IssueContent.vue'
import { WebBrowserUserCaseKey } from '@/di/types'
import { Issue, Label } from '@/domain/model/github'
import { RepositorySetting } from '@/domain/model/githubRepository'
import { WebBrowserUserCase } from '@/usecase/webBrowser'

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
const issue = new Issue(
  author,
  123,
  title,
  url,
  '2020-12-15T21:23:56Z',
  '2021-01-02T23:44:14Z',
  [label1, label2],
  2,
  3
)

describe('IssueContent.vue', () => {
  beforeEach(() => {
    openUrlMock.mockClear()
  })

  it('renders issue', async () => {
    const wrapper = shallowMount(IssueContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        issue: issue
      }
    })

    expect(wrapper.text()).toContain(`${author} created`)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.findAll('span.github-label')).toHaveLength(2)
  })

  it('can open url', async () => {
    const wrapper = shallowMount(IssueContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        issue: issue
      }
    })

    await wrapper.find('div.content-box-open').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith(url)
  })
})