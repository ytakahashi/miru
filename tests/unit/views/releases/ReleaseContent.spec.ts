import { shallowMount } from '@vue/test-utils'
import { vi } from 'vitest'
import { Release } from '@/application/domain/model/github'
import { WebBrowser } from '@/application/domain/interface/webBrowser'
import { WebBrowserKey } from '@/plugins/di/types'
import ReleaseContent from '@/views/releases/ReleaseContent.vue'

const MockedWebBrowser = vi.fn()
const openUrlMock = vi.fn()
MockedWebBrowser.mockImplementation(function MockedWebBrowserImpl(): WebBrowser {
  return {
    openUrl: (url: string) => openUrlMock(url),
  }
})
const mockedWebBrowser = new MockedWebBrowser()

const author = 'ytakahashi'
const title = 'release title'
const url = 'https://github.com/ytakahashi/miru'
const draftRelease = new Release(
  author,
  title,
  url,
  '2020-12-15T21:23:56Z',
  '2021-01-02T23:44:14Z',
  true,
  false,
  2,
  '1.0.0'
)

const release = new Release(
  author,
  title,
  url,
  '2020-12-15T21:23:56Z',
  '2021-01-02T23:44:14Z',
  false,
  false,
  2,
  '1.0.0'
)

describe('ReleaseContent.vue', () => {
  beforeEach(() => {
    openUrlMock.mockClear()
  })

  it('renders release (not draft)', async () => {
    const wrapper = shallowMount(ReleaseContent, {
      global: {
        provide: {
          [WebBrowserKey as symbol]: mockedWebBrowser,
        },
      },
      props: {
        release,
      },
    })

    expect(wrapper.text()).toContain(author)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain('published')
    expect(wrapper.text()).toMatch(/.+ .+ ago/)
  })

  it('renders draft release', async () => {
    const wrapper = shallowMount(ReleaseContent, {
      global: {
        provide: {
          [WebBrowserKey as symbol]: mockedWebBrowser,
        },
      },
      props: {
        release: draftRelease,
      },
    })

    expect(wrapper.text()).toContain(author)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain('drafted')
    expect(wrapper.text()).toMatch(/.+ .+ ago/)
  })

  it('can open release url', async () => {
    const wrapper = shallowMount(ReleaseContent, {
      global: {
        provide: {
          [WebBrowserKey as symbol]: mockedWebBrowser,
        },
      },
      props: {
        release,
      },
    })

    await wrapper.find('div.content-box-open').trigger('click')
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith(url)
  })

  it('can open draft release url', async () => {
    const wrapper = shallowMount(ReleaseContent, {
      global: {
        provide: {
          [WebBrowserKey as symbol]: mockedWebBrowser,
        },
      },
      props: {
        release: draftRelease,
      },
    })

    await wrapper.find('div.content-box-release-draft').trigger('click')
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith(url)
  })
})
