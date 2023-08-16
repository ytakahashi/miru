import { mount } from '@vue/test-utils'
import { Commit } from '@/application/domain/model/github'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'
import CommitContent from '@/views/commits/CommitContent.vue'

const MockedWebBrowserUserCase = jest.fn<WebBrowserUserCase, []>()
const openUrlMock = jest.fn()
MockedWebBrowserUserCase.mockImplementation((): WebBrowserUserCase => {
  return {
    openUrl: (url: string) => openUrlMock(url),
  }
})
const mockedWebBrowserUserCase = new MockedWebBrowserUserCase()

describe('CommitContent.vue', () => {
  beforeEach(() => {
    openUrlMock.mockClear()
  })

  const commitMessage = 'commit message'
  const commitUrl = 'https://github.com/ytakahashi/miru/commits/1234'
  const commit = new Commit(
    commitMessage,
    commitUrl,
    100,
    50,
    3,
    'ytakahashi',
    '2021-03-13T00:00:00Z',
    'ytakahashi',
    '2021-03-13T00:00:01Z',
    '2021-03-13T00:00:02Z'
  )

  it('renders issue (opened)', async () => {
    const wrapper = mount(CommitContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        commit,
      },
    })

    expect(wrapper.text()).toMatch(/ytakahashi authored .+ .+ ago/)
    expect(wrapper.text()).toMatch(/ytakahashi committed .+ .+ ago/)
    expect(wrapper.text()).toContain(commitMessage)
  })

  it('can open url', async () => {
    const wrapper = mount(CommitContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        commit,
      },
    })

    await wrapper.find('div.commit-box').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith(commitUrl)
  })
})
