/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { shallowMount } from '@vue/test-utils'
import GitHubRelease from '@/components/GitHubRelease.vue'
import ReleasesView from '@/views/ReleasesView.vue'
import { AccountSettingUseCaseFactoryKey, ApplicationSettingUseCaseKey, RepositorySettingUseCaseFactoryKey } from '@/di/types'
import { ApplicationSetting } from '@/domain/model/application'
import { Account, GitHubUrl } from '@/domain/model/github'
import { RepositorySetting } from '@/domain/model/githubRepository'
import { AccountSettingUseCase, AccountSettingUseCaseFactory } from '@/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/usecase/applicationSetting'
import { RepositorySettingUseCase, RepositorySettingUseCaseFactory } from '@/usecase/repositorySetting'

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

describe('ReleasesView.vue', () => {
  it('renders when account is not configured', async () => {
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (setting: ApplicationSetting) => new MockedRepositorySettingUseCase([])
    }

    const wrapper = shallowMount(ReleasesView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('Account is not configured.')
    expect(wrapper.findAllComponents(GitHubRelease)).toHaveLength(0)
  })

  it('renders when no repositories are configured', async () => {
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (setting: ApplicationSetting) => new MockedRepositorySettingUseCase([])
    }

    const wrapper = shallowMount(ReleasesView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([new ApplicationSetting('foo')]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('No repositories are configured.')
    expect(wrapper.findAllComponents(GitHubRelease)).toHaveLength(0)
  })

  it('renders when two repositories are configured', async () => {
    const repository1 = new RepositorySetting('https://github.com/a/b')
    const repository2 = new RepositorySetting('https://github.com/c/d')
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (setting: ApplicationSetting) =>
        new MockedRepositorySettingUseCase([repository1, repository2])
    }

    const wrapper = shallowMount(ReleasesView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([new ApplicationSetting('foo')]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('')
    expect(wrapper.findAllComponents(GitHubRelease)).toHaveLength(2)
  })

  it('renders when two repositories are configured, and one is disabled', async () => {
    const repository1 = new RepositorySetting('https://github.com/a/b')
    const repository2 = new RepositorySetting('https://github.com/c/d')
    repository2.setReleasePreference(false)
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (setting: ApplicationSetting) =>
        new MockedRepositorySettingUseCase([repository1, repository2])
    }

    const wrapper = shallowMount(ReleasesView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([new ApplicationSetting('foo')]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('')
    expect(wrapper.findAllComponents(GitHubRelease)).toHaveLength(1)
  })
})