import { mount } from '@vue/test-utils'
import GitHubRepository from '@/views/settings/GitHubRepository.vue'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'

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

  it('handles issue preference toggle', async () => {
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
    expect(inputs).toHaveLength(3)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(3)

    // toggle issue preference
    await inputs[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsIssues()).toBe(false)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(1)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(2)

    // toggle issue preference again
    await inputs[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(0)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(3)
  })

  it('handles pull request preference toggle', async () => {
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
    expect(inputs).toHaveLength(3)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(3)

    // toggle pull request preference
    await inputs[1].trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(false)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(1)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(2)

    // toggle pull request preference again
    await inputs[1].trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(0)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(3)
  })

  it('handles release preference toggle', async () => {
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
    expect(inputs).toHaveLength(3)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(3)

    // toggle release preference
    await inputs[2].trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(false)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(1)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(2)

    // toggle release preference again
    await inputs[2].trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(0)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(3)
  })
})
