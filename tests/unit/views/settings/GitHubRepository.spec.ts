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
    expect(wrapper.text()).toContain('Commit')
    expect(wrapper.text()).toContain('Issue')
    expect(wrapper.text()).toContain('PR')
    expect(wrapper.text()).toContain('Release')
  })

  it('handles commit preference toggle', async () => {
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
    expect(inputs).toHaveLength(4)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(4)

    // toggle commit preference
    const commitToggle = inputs[0]
    await commitToggle.trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsCommits()).toBe(false)
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(1)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(3)

    // toggle commit preference again
    await commitToggle.trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsCommits()).toBe(true)
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(0)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(4)
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
    expect(inputs).toHaveLength(4)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(4)

    // toggle issue preference
    const issueToggle = inputs[1]
    await issueToggle.trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsCommits()).toBe(true)
    expect(setting.showsIssues()).toBe(false)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(1)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(3)

    // toggle issue preference again
    await issueToggle.trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsCommits()).toBe(true)
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(0)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(4)
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
    expect(inputs).toHaveLength(4)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(4)

    // toggle pull request preference
    const prToggle = inputs[2]
    await prToggle.trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsCommits()).toBe(true)
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(false)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(1)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(3)

    // toggle pull request preference again
    await prToggle.trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsCommits()).toBe(true)
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(0)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(4)
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
    expect(inputs).toHaveLength(4)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(4)

    // toggle release preference
    const releaseToggle = inputs[3]
    await releaseToggle.trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsCommits()).toBe(true)
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(false)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(1)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(3)

    // toggle release preference again
    await releaseToggle.trigger('click')
    await wrapper.vm.$nextTick()
    expect(setting.showsCommits()).toBe(true)
    expect(setting.showsIssues()).toBe(true)
    expect(setting.showsPullRequests()).toBe(true)
    expect(setting.showsReleases()).toBe(true)
    expect(wrapper.findAll('i.fa-square')).toHaveLength(0)
    expect(wrapper.findAll('i.fa-check-square')).toHaveLength(4)
  })
})
