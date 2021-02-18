/* eslint-disable @typescript-eslint/no-unused-vars */

import { shallowMount } from '@vue/test-utils'
import { Release } from '@/application/domain/model/github'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'
import ReleaseContent from '@/views/releases/ReleaseContent.vue'

const MockedWebBrowserUserCase = jest.fn<WebBrowserUserCase, []>()
const openUrlMock = jest.fn()
MockedWebBrowserUserCase.mockImplementation((): WebBrowserUserCase => {
  return {
    openUrl: (url: string) => openUrlMock(url)
  }
})
const mockedWebBrowserUserCase = new MockedWebBrowserUserCase()

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
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        release: release
      }
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
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        release: draftRelease
      }
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
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        release: release
      }
    })

    await wrapper.find('div.content-box-open').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith(url)
  })

  it('can open draft release url', async () => {
    const wrapper = shallowMount(ReleaseContent, {
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        release: draftRelease
      }
    })

    await wrapper.find('div.content-box-release-draft').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith(url)
  })
})
