import { mount } from '@vue/test-utils'
import GitHubRepository from '@/components/GitHubRepository.vue'
import { WebBrowserUserCaseKey } from '@/di/types'
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

describe('GitHubRepository.vue', () => {
  it('renders when not editing', () => {
    const setting = new RepositorySetting('https://github.com/ytakahashi/miru')
    const wrapper = mount(GitHubRepository, {
      props: {
        editing: false,
        repositorySetting: setting
      },
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      }
    })

    expect(wrapper.text()).toBe('ytakahashi/miru')
  })

  it('renders when editing', async () => {
    const setting = new RepositorySetting('https://github.com/ytakahashi/miru')
    const wrapper = mount(GitHubRepository, {
      props: {
        editing: true,
        repositorySetting: setting
      },
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      }
    })

    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).toContain('Issue')
    expect(wrapper.text()).toContain('PR')
  })

  it('handles preference toggle', async () => {
    const setting = new RepositorySetting('https://github.com/ytakahashi/miru')
    const wrapper = mount(GitHubRepository, {
      props: {
        editing: true,
        repositorySetting: setting
      },
      global: {
        provide: {
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      }
    })

    const inputs = wrapper.findAll('span.preference-input')
    expect(inputs).toHaveLength(2)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(2)

    // toggle issue
    await inputs[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsIssues()).toBe(false)
    expect(setting.showsPullRequests()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(1)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(1)

    // toggle PR
    await inputs[1].trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsIssues()).toBe(false)
    expect(setting.showsPullRequests()).toBe(false)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(2)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(0)

    // toggle Issue again
    await inputs[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(false)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(1)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(1)
  })
})
