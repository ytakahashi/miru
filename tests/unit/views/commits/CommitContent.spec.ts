import { Commit } from '@/application/domain/model/github'
import { WebBrowser } from '@/application/domain/interface/webBrowser'
import { WebBrowserKey } from '@/plugins/di/types'
import CommitContent from '@/views/commits/CommitContent.vue'
import StatusIcon from '@/components/StatusIcon.vue'
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'

const MockedWebBrowser = vi.fn()
const openUrlMock = vi.fn()
MockedWebBrowser.mockImplementation(function MockedWebBrowserImpl(): WebBrowser {
  return {
    openUrl: (url: string) => openUrlMock(url),
  }
})
const mockedWebBrowser = new MockedWebBrowser()

describe('CommitContent.vue', () => {
  beforeEach(() => {
    openUrlMock.mockClear()
  })

  const commitMessage = 'commit message'
  const commitUrl = 'https://github.com/ytakahashi/miru/commits/1234567898765432'
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
    'SUCCESS'
  )

  it('renders commit', async () => {
    const wrapper = mount(CommitContent, {
      global: {
        provide: {
          [WebBrowserKey as symbol]: mockedWebBrowser,
        },
      },
      props: {
        commit,
      },
    })

    const spans = wrapper.findAll('span.tooltip')
    expect(spans).toHaveLength(4)
    expect(spans[0].text()).toMatch(/.+ ago/)
    expect(spans[1].text()).toBe('12345678')
    expect(spans[2].text()).toMatch(/ytakahashi authored .+ .+ ago/)
    expect(spans[3].text()).toMatch(/ytakahashi committed .+ .+ ago/)

    expect(wrapper.find('p.commit-message_headline').text()).toBe('commit message')
    expect(wrapper.find('p.commit-message').text()).toBe('')
    expect(wrapper.findComponent(StatusIcon).exists()).toBe(true)
  })

  it('can open url', async () => {
    const wrapper = mount(CommitContent, {
      global: {
        provide: {
          [WebBrowserKey as symbol]: mockedWebBrowser,
        },
      },
      props: {
        commit,
      },
    })

    await wrapper.find('div.commit-box').trigger('click')
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith(commitUrl)
  })
})
