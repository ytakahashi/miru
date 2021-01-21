/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { shallowMount } from '@vue/test-utils'
import AccountSetting from '@/components/AccountSetting.vue'
import GitHubRepositories from '@/components/GitHubRepositories.vue'
import { AccountSettingUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/di/types'
import { ApplicationSetting } from '@/domain/model/application'
import { Account, GitHubUrl } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { WebBrowserUserCase } from '@/usecase/webBrowser'
import { AccountSettingUseCase, AccountSettingUseCaseFactory } from '@/usecase/accountSetting'

const url = new GitHubUrl('https://github.com', 'https://api.github.com/graphql')
const account = new Account('name', 'https://github.com/ytakahashi', 'avatar', url, 'pat')
const setting = new ApplicationSetting('foo')

// WebBrowserUserCase mock
const MockedWebBrowserUserCase = jest.fn<WebBrowserUserCase, []>()
const openUrlMock = jest.fn()
MockedWebBrowserUserCase.mockImplementation((): WebBrowserUserCase => {
  return {
    openUrl: (url: string) => openUrlMock(url)
  }
})
const mockedWebBrowserUserCase = new MockedWebBrowserUserCase()

// AccountSettingUseCase mock
const addRepositoryUrlMock = jest.fn()
const deleteRepositoryUrlMock = jest.fn()
const setRepositoryUrlsMock = jest.fn()
const deleteSettingMock = jest.fn()
const MockedAccountSettingUseCase = jest.fn<AccountSettingUseCase, [Array<RepositoryUrl>]>()
MockedAccountSettingUseCase.mockImplementation((arr: Array<RepositoryUrl>): AccountSettingUseCase => {
  return {
    addRepositoryUrl: (url: RepositoryUrl) => addRepositoryUrlMock(),
    deleteRepositoryUrl: (url: RepositoryUrl) => deleteRepositoryUrlMock(),
    getRepositoryUrls: () => arr,
    setRepositoryUrls: (urls: Array<RepositoryUrl>) => setRepositoryUrlsMock(),
    clearRepositoryUrls: () => {},
    setAccount: (account: Account) => {},
    getAccount: () => account,
    deleteSetting: () => deleteSettingMock()
  }
})

// AccountSettingUseCaseFactory mock
const createMock = (func: () => AccountSettingUseCase): AccountSettingUseCaseFactory => {
  return {
    newAccountSettingUseCase: (setting: ApplicationSetting) => func()
  }
}

describe('AccountSetting.vue', () => {
  beforeEach(() => {
    addRepositoryUrlMock.mockClear()
    setRepositoryUrlsMock.mockClear()
    deleteSettingMock.mockClear()
    openUrlMock.mockClear()
  })

  it('renders', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: createMock(() => new MockedAccountSettingUseCase([])),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        setting: setting
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(GitHubRepositories)).toHaveLength(1)
  })

  it('input form appears/disappears after child component emits edit event', async () => {
    const repo1 = new RepositoryUrl('https://github.com/a/b')
    const repo2 = new RepositoryUrl('https://github.com/c/d')
    const repos = [repo1, repo2]
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: createMock(() => new MockedAccountSettingUseCase(repos)),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        },
        stubs: {
          GitHubRepositories: true
        }
      },
      props: {
        setting: setting
      }
    })
    await wrapper.vm.$nextTick()

    const repositoriesStub = wrapper.findComponent(GitHubRepositories)
    await repositoriesStub.vm.$emit('edit', true)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').exists()).toBe(true)
    expect(setRepositoryUrlsMock).not.toHaveBeenCalled()

    await repositoriesStub.vm.$emit('edit', false)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').exists()).toBe(false)
    expect(setRepositoryUrlsMock).toHaveBeenCalled()
  })

  it('validates input', async () => {
    const repo1 = new RepositoryUrl('https://github.com/a/b')
    const repo2 = new RepositoryUrl('https://github.com/c/d')
    const repos = [repo1, repo2]
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: createMock(() => new MockedAccountSettingUseCase(repos)),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        },
        stubs: {
          GitHubRepositories: true
        }
      },
      props: {
        setting: setting
      }
    })

    await wrapper.vm.$nextTick()
    const repositoriesStub = wrapper.findComponent(GitHubRepositories)
    await repositoriesStub.vm.$emit('edit', true)
    await wrapper.vm.$nextTick()

    const urlInput = wrapper.find('input')
    const addButton = wrapper.find('button')

    // set invalid input
    await urlInput.setValue('foo')
    addButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Invalid URL: foo')

    // set valid input
    await urlInput.setValue('https://github.com/ytakahashi/miru')
    addButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).not.toContain('Invalid URL')
    expect(addRepositoryUrlMock).toHaveBeenCalledTimes(1)
  })

  it('can open profile url', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: createMock(() => new MockedAccountSettingUseCase([])),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        setting: setting
      }
    })
    await wrapper.find('span.profile-url').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith('https://github.com/ytakahashi')
  })

  it('can delete account', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: createMock(() => new MockedAccountSettingUseCase([])),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        setting: setting
      }
    })
    await wrapper.find('i.fa-trash-alt').trigger('click')
    expect(deleteSettingMock).toHaveBeenCalledTimes(1)
  })
})