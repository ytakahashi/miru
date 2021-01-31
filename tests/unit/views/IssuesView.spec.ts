/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { defineComponent, h } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { AccountSettingUseCaseFactoryKey, ApplicationSettingUseCaseKey, RepositorySettingUseCaseFactoryKey } from '@/plugins/di/types'
import { ApplicationSetting } from '@/application/domain/model/application'
import { Account, GitHubUrl } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { AccountSettingUseCase, AccountSettingUseCaseFactory } from '@/application/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/application/usecase/applicationSetting'
import { RepositorySettingUseCase, RepositorySettingUseCaseFactory } from '@/application/usecase/repositorySetting'
import IssuesView from '@/views/IssuesView.vue'
import GitHubIssue from '@/views/issues/GitHubIssue.vue'

const account = new Account('name', 'profile', 'avatar', jest.fn<GitHubUrl, []>()(), 'pat')

const MockedApplicationSettingUseCase = jest.fn<ApplicationSettingUseCase, [Array<ApplicationSetting>]>()
MockedApplicationSettingUseCase.mockImplementation((arr: Array<ApplicationSetting>): ApplicationSettingUseCase => {
  return {
    hasSetting: (setting: ApplicationSetting) => true,
    getSettings: () => arr,
    addSetting: (setting: ApplicationSetting) => {},
    removeSetting: (setting: ApplicationSetting) => {}
  }
})

const MockedAccountSettingUseCase = jest.fn<AccountSettingUseCase, []>()
MockedAccountSettingUseCase.mockImplementation((): AccountSettingUseCase => {
  return {
    setAccount (account: Account): void {},
    getAccount (): Account { return account },
    deleteSetting (): void {}
  }
})

const MockedRepositorySettingUseCase = jest.fn<RepositorySettingUseCase, [Array<RepositorySetting>]>()
MockedRepositorySettingUseCase.mockImplementation((arr: Array<RepositorySetting>): RepositorySettingUseCase => {
  return {
    addRepositorySetting: (s: RepositorySetting) => true,
    deleteRepositorySetting: (s: RepositorySetting) => {},
    getRepositorySettings: () => arr,
    setRepositorySettings: (s: Array<RepositorySetting>) => {}
  }
})
const mockedAccountSettingUseCaseFactory: AccountSettingUseCaseFactory = {
  newAccountSettingUseCase: (setting: ApplicationSetting): AccountSettingUseCase => {
    return new MockedAccountSettingUseCase()
  }
}

const RepositoryFilterMock = defineComponent({
  name: 'RepositoryFilter',
  methods: {
    isVisible: () => true
  },
  render: () => h('input', {}, '')
})

describe('IssuesView.vue', () => {
  it('renders when account is not configured', async () => {
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (setting: ApplicationSetting) => new MockedRepositorySettingUseCase([])
    }

    const wrapper = shallowMount(IssuesView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock
        },
        stubs: {
          RepositoryFilter: RepositoryFilterMock
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('Account is not configured.')
    expect(wrapper.findAllComponents(GitHubIssue)).toHaveLength(0)
  })

  it('renders when no repositories are configured', async () => {
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (setting: ApplicationSetting) => new MockedRepositorySettingUseCase([])
    }

    const wrapper = shallowMount(IssuesView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([new ApplicationSetting('foo')]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock
        },
        stubs: {
          RepositoryFilter: RepositoryFilterMock
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('No repositories are configured.')
    expect(wrapper.findAllComponents(GitHubIssue)).toHaveLength(0)
  })

  it('renders when two repositories are configured', async () => {
    const repository1 = new RepositorySetting('https://github.com/a/b')
    const repository2 = new RepositorySetting('https://github.com/c/d')
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (setting: ApplicationSetting) =>
        new MockedRepositorySettingUseCase([repository1, repository2])
    }

    const wrapper = shallowMount(IssuesView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([new ApplicationSetting('foo')]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock
        },
        stubs: {
          RepositoryFilter: RepositoryFilterMock
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('')
    expect(wrapper.findAllComponents(GitHubIssue)).toHaveLength(2)
  })

  it('renders when two repositories are configured, and one is disabled', async () => {
    const repository1 = new RepositorySetting('https://github.com/a/b')
    const repository2 = new RepositorySetting('https://github.com/c/d')
    repository2.setIssuePreference(false)
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (setting: ApplicationSetting) =>
        new MockedRepositorySettingUseCase([repository1, repository2])
    }

    const wrapper = shallowMount(IssuesView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([new ApplicationSetting('foo')]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock
        },
        stubs: {
          RepositoryFilter: RepositoryFilterMock
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('')
    expect(wrapper.findAllComponents(GitHubIssue)).toHaveLength(1)
  })
})
