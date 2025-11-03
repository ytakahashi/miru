import { ApplicationSetting } from '@/application/domain/model/application'
import { Account, GitHubUrl } from '@/application/domain/model/github'
import {
  AccountSettingUseCase,
  AccountSettingUseCaseFactory,
} from '@/application/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/application/usecase/applicationSetting'
import { GitHubAccountUseCase } from '@/application/usecase/githubAccount'
import {
  AccountSettingUseCaseFactoryKey,
  ApplicationSettingUseCaseKey,
  GitHubAccountUseCaseFactoryKey,
} from '@/plugins/di/types'
import SettingView from '@/views/SettingView.vue'
import AccountSetting from '@/views/settings/AccountSetting.vue'
import { shallowMount } from '@vue/test-utils'
import { vi } from 'vitest'
import { defineComponent, h } from 'vue'

const url = new GitHubUrl('https://github.com', 'https://api.github.com/graphql')
const account = new Account('name', 'https://github.com/ytakahashi', 'avatar', url, 'pat')

// AccountSettingUseCase mock
const MockedAccountSettingUseCase = vi.fn()
const newAccountSettingUseCaseMock = vi.fn()
MockedAccountSettingUseCase.mockImplementation(
  function MockedAccountSettingUseCaseImpl(): AccountSettingUseCase {
    return {
      setAccount(_account: Account): void {},
      getAccount(): Account {
        return account
      },
      deleteSetting(): void {},
    }
  }
)
const mockedAccountSettingUseCaseFactory: AccountSettingUseCaseFactory = {
  newAccountSettingUseCase: (setting: ApplicationSetting): AccountSettingUseCase => {
    newAccountSettingUseCaseMock(setting)
    return new MockedAccountSettingUseCase()
  },
}

// ApplicationSettingUseCase mock
const addSettingMock = vi.fn()
const removeSettingMock = vi.fn()
const MockedApplicationSettingUseCase = vi.fn()
MockedApplicationSettingUseCase.mockImplementation(function MockedApplicationSettingUseCaseImpl(
  settings: Array<ApplicationSetting>
): ApplicationSettingUseCase {
  return {
    hasSetting: (setting: ApplicationSetting) => settings.some(s => s.equals(setting)),
    getSettings: () => settings,
    addSetting: (_setting: ApplicationSetting) => addSettingMock(),
    removeSetting: (_setting: ApplicationSetting) => removeSettingMock(),
  }
})

// GitHubAccountUseCase mock
const MockedGitHubAccountUseCase = vi.fn()
MockedGitHubAccountUseCase.mockImplementation(
  function MockedGitHubAccountUseCaseImpl(): GitHubAccountUseCase {
    return {
      resolvePersonalAccessToken: async (_personalAccessToken: string) => account,
    }
  }
)

const MockedGitHubAccountUseCaseFactory = vi.fn()
MockedGitHubAccountUseCaseFactory.mockImplementation(
  function MockedGitHubAccountUseCaseFactoryImpl() {
    return {
      newGitHubAccountUseCase: (_githubUrl: GitHubUrl) => new MockedGitHubAccountUseCase(),
    }
  }
)
const mockedGitHubAccountUseCaseFactory = new MockedGitHubAccountUseCaseFactory()

// logger mock
vi.mock('@/application/core/logger', () => ({
  logger: vi.fn(),
}))

const AccountSettingMock = defineComponent({
  name: 'AccountSetting',
  emits: ['account-deleted'],
  render: () => h('div', {}, ''),
})

describe('SettingView.vue', () => {
  beforeEach(() => {
    addSettingMock.mockClear()
    removeSettingMock.mockClear()
  })

  it('renders when account is not configured', async () => {
    const mockedApplicationSettingUseCase = new MockedApplicationSettingUseCase([])
    const wrapper = shallowMount(SettingView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: mockedApplicationSettingUseCase,
          [GitHubAccountUseCaseFactoryKey as symbol]: mockedGitHubAccountUseCaseFactory,
        },
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(AccountSetting)).toHaveLength(0)
  })

  it('renders when two accounts are configured', async () => {
    const applicationSetting1 = new ApplicationSetting('test1')
    const applicationSetting2 = new ApplicationSetting('test2')
    const applicationSettings = [applicationSetting1, applicationSetting2]

    const mockedApplicationSettingUseCase = new MockedApplicationSettingUseCase(applicationSettings)
    const wrapper = shallowMount(SettingView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: mockedApplicationSettingUseCase,
          [GitHubAccountUseCaseFactoryKey as symbol]: mockedGitHubAccountUseCaseFactory,
        },
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(AccountSetting)).toHaveLength(2)
  })

  it('shows edit menu', async () => {
    const mockedApplicationSettingUseCase = new MockedApplicationSettingUseCase([])
    const wrapper = shallowMount(SettingView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: mockedApplicationSettingUseCase,
          [GitHubAccountUseCaseFactoryKey as symbol]: mockedGitHubAccountUseCaseFactory,
        },
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(AccountSetting)).toHaveLength(0)
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.find('div.input-form-block').exists()).toBe(false)

    // When: click add button
    await wrapper.find('button.open-form-button').trigger('click')
    await wrapper.vm.$nextTick()

    // Then: shows input menu
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('div.input-form-block').exists()).toBe(true)
    expect(wrapper.text()).toContain('GitHub URL (default: https://github.com)')
    expect(wrapper.text()).toContain('GitHub Personal Access Token')
  })

  it('can add an account', async () => {
    const mockedApplicationSettingUseCase = new MockedApplicationSettingUseCase([])
    const wrapper = shallowMount(SettingView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: mockedApplicationSettingUseCase,
          [GitHubAccountUseCaseFactoryKey as symbol]: mockedGitHubAccountUseCaseFactory,
        },
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(AccountSetting)).toHaveLength(0)
    expect(wrapper.find('div.input-form-block').exists()).toBe(false)
    await wrapper.find('button.open-form-button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('div.input-form-block').exists()).toBe(true)

    // Given: set personal access token
    await wrapper.find('input#pat-input').setValue('foo')

    // When: click add account button
    await wrapper.find('button.add-account-button').trigger('click')
    await wrapper.vm.$nextTick()

    // Then: account is added
    expect(wrapper.findAllComponents(AccountSetting)).toHaveLength(1)
    expect(wrapper.find('div.input-form-block').exists()).toBe(false)
    expect(addSettingMock).toHaveBeenCalledTimes(1)
  })

  it('can delete an account', async () => {
    const applicationSetting1 = new ApplicationSetting('test1')
    const applicationSetting2 = new ApplicationSetting('test2')
    const applicationSettings = [applicationSetting1, applicationSetting2]

    const mockedApplicationSettingUseCase = new MockedApplicationSettingUseCase(applicationSettings)
    const wrapper = shallowMount(SettingView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: mockedApplicationSettingUseCase,
          [GitHubAccountUseCaseFactoryKey as symbol]: mockedGitHubAccountUseCaseFactory,
        },
        stubs: {
          AccountSetting: AccountSettingMock,
        },
      },
    })

    await wrapper.vm.$nextTick()
    const accountSettingStubs = wrapper.findAllComponents(AccountSetting)
    expect(accountSettingStubs).toHaveLength(2)

    // When: account-deleted event is emitted from child
    await accountSettingStubs[0].vm.$emit('account-deleted', applicationSetting1)

    // Then: account is deleted
    expect(removeSettingMock).toHaveBeenCalledTimes(1)
  })

  it('shows error message when add account button is clicked without input', async () => {
    const mockedApplicationSettingUseCase = new MockedApplicationSettingUseCase([])
    const wrapper = shallowMount(SettingView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: mockedApplicationSettingUseCase,
          [GitHubAccountUseCaseFactoryKey as symbol]: mockedGitHubAccountUseCaseFactory,
        },
      },
    })

    await wrapper.find('button.open-form-button').trigger('click')
    await wrapper.vm.$nextTick()

    // When: add account button is clicked
    await wrapper.find('button.add-account-button').trigger('click')
    await wrapper.vm.$nextTick()

    // Then: error message appears
    expect(wrapper.text()).toContain('Access token is required.')
  })

  it('shows error message for invalid url', async () => {
    const mockedApplicationSettingUseCase = new MockedApplicationSettingUseCase([])
    const wrapper = shallowMount(SettingView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: mockedApplicationSettingUseCase,
          [GitHubAccountUseCaseFactoryKey as symbol]: mockedGitHubAccountUseCaseFactory,
        },
      },
    })

    await wrapper.find('button.open-form-button').trigger('click')
    await wrapper.vm.$nextTick()

    await wrapper.find('input#pat-input').setValue('foo')

    // Given: set invalid github url
    await wrapper.find('input#url-input').setValue('bar')

    // When: add account button is clicked
    await wrapper.find('button.add-account-button').trigger('click')
    await wrapper.vm.$nextTick()

    // Then: error message appears
    expect(wrapper.text()).toContain('Invalid GitHub URL: bar')
  })

  it('shows/hides personal access token input', async () => {
    const mockedApplicationSettingUseCase = new MockedApplicationSettingUseCase([])
    const wrapper = shallowMount(SettingView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: mockedApplicationSettingUseCase,
          [GitHubAccountUseCaseFactoryKey as symbol]: mockedGitHubAccountUseCaseFactory,
        },
      },
    })

    await wrapper.find('button.open-form-button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('i.fa-eye').exists()).toBe(true)
    expect(wrapper.find('i.fa-eye-slash').exists()).toBe(false)

    await wrapper.find('i.fa-eye').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('i.fa-eye').exists()).toBe(false)
    expect(wrapper.find('i.fa-eye-slash').exists()).toBe(true)

    await wrapper.find('i.fa-eye-slash').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('i.fa-eye').exists()).toBe(true)
    expect(wrapper.find('i.fa-eye-slash').exists()).toBe(false)
  })
})
