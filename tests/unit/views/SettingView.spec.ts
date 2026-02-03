import { ApplicationSetting } from '@/application/domain/model/application'
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

// AccountSettingUseCase mock
import {
  createMockAccountSettingUseCaseFactory,
  createMockApplicationSettingUseCase,
  createMockGitHubAccountUseCaseFactory,
} from '../helper/mockFactory'

const mockedAccountSettingUseCaseFactory = createMockAccountSettingUseCaseFactory()

// ApplicationSettingUseCase mock
const addSettingMock = vi.fn()
const removeSettingMock = vi.fn()
const createApplicationSettingMock = (settings: Array<ApplicationSetting> = []) => {
  return createMockApplicationSettingUseCase(settings, {
    addSetting: (_setting: ApplicationSetting) => addSettingMock(),
    removeSetting: (_setting: ApplicationSetting) => removeSettingMock(),
  })
}

// GitHubAccountUseCase mock
const mockedGitHubAccountUseCaseFactory = createMockGitHubAccountUseCaseFactory()

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
    const mockedApplicationSettingUseCase = createApplicationSettingMock([])
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

    const mockedApplicationSettingUseCase = createApplicationSettingMock(applicationSettings)
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
    const mockedApplicationSettingUseCase = createApplicationSettingMock([])
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
    const mockedApplicationSettingUseCase = createApplicationSettingMock([])
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

    const mockedApplicationSettingUseCase = createApplicationSettingMock(applicationSettings)
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
    const mockedApplicationSettingUseCase = createApplicationSettingMock([])
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
    const mockedApplicationSettingUseCase = createApplicationSettingMock([])
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
    const mockedApplicationSettingUseCase = createApplicationSettingMock([])
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
