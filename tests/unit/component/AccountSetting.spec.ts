/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { shallowMount } from '@vue/test-utils'
import { AccountSettingUseCaseFactoryKey, RepositorySettingUseCaseFactoryKey, WebBrowserUserCaseKey } from '@/di/types'
import { ApplicationSetting } from '@/application/domain/model/application'
import { Account, GitHubUrl } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import { AccountSettingUseCase, AccountSettingUseCaseFactory } from '@/application/usecase/accountSetting'
import { RepositorySettingUseCase, RepositorySettingUseCaseFactory } from '@/application/usecase/repositorySetting'
import AccountSetting from '@/components/AccountSetting.vue'
import GitHubRepositories from '@/components/GitHubRepositories.vue'

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
const addRepositorySettingMock = jest.fn()
const deleteRepositorySettingMock = jest.fn()
const setRepositorySettingsMock = jest.fn()
const deleteSettingMock = jest.fn()
const MockedAccountSettingUseCase = jest.fn<AccountSettingUseCase, []>()
MockedAccountSettingUseCase.mockImplementation((): AccountSettingUseCase => {
  return {
    setAccount: (account: Account) => {},
    getAccount: () => account,
    deleteSetting: () => deleteSettingMock()
  }
})

// AccountSettingUseCaseFactory mock
const createAccountSettingMock = (func: () => AccountSettingUseCase): AccountSettingUseCaseFactory => {
  return {
    newAccountSettingUseCase: (setting: ApplicationSetting) => func()
  }
}

const MockedRepositorySettingUseCase = jest.fn<RepositorySettingUseCase, [Array<RepositorySetting>]>()
MockedRepositorySettingUseCase.mockImplementation((arr: Array<RepositorySetting>): RepositorySettingUseCase => {
  return {
    addRepositorySetting: (s: RepositorySetting) => addRepositorySettingMock(),
    deleteRepositorySetting: (s: RepositorySetting) => deleteRepositorySettingMock(),
    getRepositorySettings: () => arr,
    setRepositorySettings: (s: Array<RepositorySetting>) => setRepositorySettingsMock()
  }
})
const createRepositorySettingMock = (func: () => RepositorySettingUseCase): RepositorySettingUseCaseFactory => {
  return {
    newRepositorySettingUseCase: (setting: ApplicationSetting) => func()
  }
}

describe('AccountSetting.vue', () => {
  beforeEach(() => {
    addRepositorySettingMock.mockClear()
    setRepositorySettingsMock.mockClear()
    deleteSettingMock.mockClear()
    openUrlMock.mockClear()
  })

  it('renders', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(() => new MockedAccountSettingUseCase()),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(() => new MockedRepositorySettingUseCase([])),
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
    const repo1 = new RepositorySetting('https://github.com/a/b')
    const repo2 = new RepositorySetting('https://github.com/c/d')
    const repos = [repo1, repo2]
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(() => new MockedAccountSettingUseCase()),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(() => new MockedRepositorySettingUseCase(repos)),
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
    expect(setRepositorySettingsMock).not.toHaveBeenCalled()

    await repositoriesStub.vm.$emit('edit', false)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').exists()).toBe(false)
    expect(setRepositorySettingsMock).toHaveBeenCalled()
  })

  it('validates input', async () => {
    const repo1 = new RepositorySetting('https://github.com/a/b')
    const repo2 = new RepositorySetting('https://github.com/c/d')
    const repos = [repo1, repo2]
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(() => new MockedAccountSettingUseCase()),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(() => new MockedRepositorySettingUseCase(repos)),
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
    expect(addRepositorySettingMock).toHaveBeenCalledTimes(1)
  })

  it('can open profile url', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(() => new MockedAccountSettingUseCase()),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(() => new MockedRepositorySettingUseCase([])),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase
        }
      },
      props: {
        setting: setting
      }
    })
    await wrapper.find('span.text-strong').trigger('click')
    expect(openUrlMock).toHaveBeenCalledWith('https://github.com/ytakahashi')
  })

  it('can delete account', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(() => new MockedAccountSettingUseCase()),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(() => new MockedRepositorySettingUseCase([])),
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
