import { ApplicationSetting } from '@/application/domain/model/application'
import { Account, GitHubUrl } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import {
  AccountSettingUseCase,
  AccountSettingUseCaseFactory,
} from '@/application/usecase/accountSetting'
import {
  RepositorySettingUseCase,
  RepositorySettingUseCaseFactory,
} from '@/application/usecase/repositorySetting'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'
import ModalWindow from '@/components/ModalWindow.vue'
import {
  AccountSettingUseCaseFactoryKey,
  RepositorySettingUseCaseFactoryKey,
  WebBrowserUserCaseKey,
} from '@/plugins/di/types'
import AccountSetting from '@/views/settings/AccountSetting.vue'
import GitHubRepositories from '@/views/settings/GitHubRepositories.vue'
import { shallowMount } from '@vue/test-utils'
import { vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { matchedRouteKey } from 'vue-router'

const url = new GitHubUrl('https://github.com', 'https://api.github.com/graphql')
const account = new Account('name', 'https://github.com/ytakahashi', 'avatar', url, 'pat')
const setting = new ApplicationSetting('foo')

// WebBrowserUserCase mock
const MockedWebBrowserUserCase = vi.fn()
const openUrlMock = vi.fn()
MockedWebBrowserUserCase.mockImplementation(
  function MockedWebBrowserUserCaseImpl(): WebBrowserUserCase {
    return {
      openUrl: (url: string) => openUrlMock(url),
    }
  }
)
const mockedWebBrowserUserCase = new MockedWebBrowserUserCase()

// AccountSettingUseCase mock
const addRepositorySettingMock = vi.fn()
const deleteRepositorySettingMock = vi.fn()
const setRepositorySettingsMock = vi.fn()
const deleteSettingMock = vi.fn()
const setAccountMock = vi.fn()
const MockedAccountSettingUseCase = vi.fn()
MockedAccountSettingUseCase.mockImplementation(
  function MockedAccountSettingUseCaseImpl(): AccountSettingUseCase {
    return {
      setAccount: (account: Account) => setAccountMock(account),
      getAccount: () => account,
      deleteSetting: () => deleteSettingMock(),
    }
  }
)
const mockedAccountSettingUseCase = new MockedAccountSettingUseCase()

// AccountSettingUseCaseFactory mock
const createAccountSettingMock = (
  func: () => AccountSettingUseCase
): AccountSettingUseCaseFactory => {
  return {
    newAccountSettingUseCase: (_setting: ApplicationSetting) => func(),
  }
}

const MockedRepositorySettingUseCase = vi.fn()
MockedRepositorySettingUseCase.mockImplementation(function MockedRepositorySettingUseCaseImpl(
  arr: Array<RepositorySetting>
): RepositorySettingUseCase {
  return {
    addRepositorySetting: (_s: RepositorySetting) => addRepositorySettingMock(),
    deleteRepositorySetting: (_s: RepositorySetting) => deleteRepositorySettingMock(),
    getRepositorySettings: () => arr,
    setRepositorySettings: (_s: Array<RepositorySetting>) => setRepositorySettingsMock(),
  }
})
const createRepositorySettingMock = (
  func: () => RepositorySettingUseCase
): RepositorySettingUseCaseFactory => {
  return {
    newRepositorySettingUseCase: (_setting: ApplicationSetting) => func(),
  }
}

// GitHubRepositories Mock
const GitHubRepositoriesMock = defineComponent({
  name: 'GitHubRepositories',
  emits: ['deleteRepository', 'editCancel', 'editComplete', 'editStart'],
  render: () => h('div', {}, ''),
})

// ModalWindow Mock
const ModalWindowMock = defineComponent({
  name: 'ModalWindow',
  emits: ['cancel', 'ok'],
  render: () => h('div', {}, ''),
})

// vue router (onBeforeRouteLeave) mock
const mockRoute = {
  value: {
    leaveGuards: {
      add: () => vi.fn(),
    },
  },
}

describe('AccountSetting.vue', () => {
  beforeEach(() => {
    addRepositorySettingMock.mockClear()
    setRepositorySettingsMock.mockClear()
    setAccountMock.mockClear()
    deleteSettingMock.mockClear()
    openUrlMock.mockClear()
  })

  it('renders', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [matchedRouteKey as symbol]: mockRoute,
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(
            () => new MockedAccountSettingUseCase()
          ),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(
            () => new MockedRepositorySettingUseCase([])
          ),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        setting,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(GitHubRepositories)).toHaveLength(1)
  })

  it('input form appears/disappears after child component emits editStart/Complete event', async () => {
    const repo1 = new RepositorySetting('https://github.com/a/b')
    const repo2 = new RepositorySetting('https://github.com/c/d')
    const repos = [repo1, repo2]
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [matchedRouteKey as symbol]: mockRoute,
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(
            () => new MockedAccountSettingUseCase()
          ),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(
            () => new MockedRepositorySettingUseCase(repos)
          ),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
        stubs: {
          GitHubRepositories: GitHubRepositoriesMock,
        },
      },
      props: {
        setting,
      },
    })
    await wrapper.vm.$nextTick()

    const repositoriesStub = wrapper.findComponent(GitHubRepositories)
    await repositoriesStub.vm.$emit('editStart')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').exists()).toBe(true)
    expect(setRepositorySettingsMock).not.toHaveBeenCalled()

    await repositoriesStub.vm.$emit('editComplete', [])
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').exists()).toBe(false)
    expect(setRepositorySettingsMock).toHaveBeenCalled()
  })

  it('input form appears/disappears after child component emits editStart/Cancel event', async () => {
    const repo1 = new RepositorySetting('https://github.com/a/b')
    const repo2 = new RepositorySetting('https://github.com/c/d')
    const repos = [repo1, repo2]
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [matchedRouteKey as symbol]: mockRoute,
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(
            () => new MockedAccountSettingUseCase()
          ),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(
            () => new MockedRepositorySettingUseCase(repos)
          ),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
        stubs: {
          GitHubRepositories: GitHubRepositoriesMock,
        },
      },
      props: {
        setting,
      },
    })
    await wrapper.vm.$nextTick()

    const repositoriesStub = wrapper.findComponent(GitHubRepositories)
    await repositoriesStub.vm.$emit('editStart')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').exists()).toBe(true)
    expect(setRepositorySettingsMock).not.toHaveBeenCalled()

    await repositoriesStub.vm.$emit('editCancel')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').exists()).toBe(false)
    expect(setRepositorySettingsMock).not.toHaveBeenCalled()
  })

  it('validates input', async () => {
    const repo1 = new RepositorySetting('https://github.com/a/b')
    const repo2 = new RepositorySetting('https://github.com/c/d')
    const repos = [repo1, repo2]
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [matchedRouteKey as symbol]: mockRoute,
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(
            () => new MockedAccountSettingUseCase()
          ),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(
            () => new MockedRepositorySettingUseCase(repos)
          ),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
        stubs: {
          GitHubRepositories: GitHubRepositoriesMock,
        },
      },
      props: {
        setting,
      },
    })

    await wrapper.vm.$nextTick()
    const repositoriesStub = wrapper.findComponent(GitHubRepositories)
    await repositoriesStub.vm.$emit('editStart')
    await wrapper.vm.$nextTick()

    const urlInput = wrapper.find('input')
    const addButton = wrapper.find('button')

    // click without input
    await addButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('GitHub repository URL is not specified.')

    // set invalid input
    await urlInput.setValue('foo')
    await addButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Invalid URL: foo')

    // set valid input
    await urlInput.setValue('https://github.com/ytakahashi/miru')
    await addButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).not.toContain('Invalid URL')
    expect(addRepositorySettingMock).toHaveBeenCalledTimes(1)
  })

  it('can open profile url', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [matchedRouteKey as symbol]: mockRoute,
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(
            () => new MockedAccountSettingUseCase()
          ),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(
            () => new MockedRepositorySettingUseCase([])
          ),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        setting,
      },
    })
    await wrapper.find('span.text-strong').trigger('click')
    expect(openUrlMock).toHaveBeenCalledExactlyOnceWith('https://github.com/ytakahashi')
  })

  it('can edit access token', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [matchedRouteKey as symbol]: mockRoute,
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(
            () => mockedAccountSettingUseCase
          ),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(
            () => new MockedRepositorySettingUseCase([])
          ),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        setting,
      },
    })

    // save button is not visible at first
    expect(wrapper.find('i.fa-save').exists()).toBe(false)

    // after clicking edit button, save button becomes visible
    await wrapper.find('i.fa-edit').trigger('click')
    expect(wrapper.find('i.fa-save').exists()).toBe(true)

    // when clicking the save button, setAccount method should be called
    await wrapper.find('i.fa-save').trigger('click')
    expect(setAccountMock).toHaveBeenCalledExactlyOnceWith(account)
  })

  it('can open modal', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [matchedRouteKey as symbol]: mockRoute,
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(
            () => new MockedAccountSettingUseCase()
          ),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(
            () => new MockedRepositorySettingUseCase([])
          ),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
      },
      props: {
        setting,
      },
    })
    expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)
    await wrapper.find('i.fa-trash-alt').trigger('click')
    expect(wrapper.findComponent(ModalWindow).exists()).toBe(true)
  })

  it('can close modal', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [matchedRouteKey as symbol]: mockRoute,
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(
            () => new MockedAccountSettingUseCase()
          ),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(
            () => new MockedRepositorySettingUseCase([])
          ),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
        stubs: {
          ModalWindow: ModalWindowMock,
        },
      },
      props: {
        setting,
      },
    })

    await wrapper.find('i.fa-trash-alt').trigger('click')
    const modal = wrapper.findComponent(ModalWindow)
    await modal.vm.$emit('cancel')
    expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)
    expect(deleteSettingMock).toHaveBeenCalledTimes(0)
  })

  it('can delete account', async () => {
    const wrapper = shallowMount(AccountSetting, {
      global: {
        provide: {
          [matchedRouteKey as symbol]: mockRoute,
          [AccountSettingUseCaseFactoryKey as symbol]: createAccountSettingMock(
            () => new MockedAccountSettingUseCase()
          ),
          [RepositorySettingUseCaseFactoryKey as symbol]: createRepositorySettingMock(
            () => new MockedRepositorySettingUseCase([])
          ),
          [WebBrowserUserCaseKey as symbol]: mockedWebBrowserUserCase,
        },
        stubs: {
          ModalWindow: ModalWindowMock,
        },
      },
      props: {
        setting,
      },
    })

    await wrapper.find('i.fa-trash-alt').trigger('click')
    const modal = wrapper.findComponent(ModalWindow)
    await modal.vm.$emit('ok')
    expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)
    expect(deleteSettingMock).toHaveBeenCalledTimes(1)
  })
})
