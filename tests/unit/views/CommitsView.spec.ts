import { defineComponent, h } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { vi } from 'vitest'
import {
  AccountSettingUseCaseFactoryKey,
  ApplicationSettingUseCaseKey,
  RepositorySettingUseCaseFactoryKey,
} from '@/plugins/di/types'
import { ApplicationSetting } from '@/application/domain/model/application'
import { Account, GitHubUrl } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import {
  AccountSettingUseCase,
  AccountSettingUseCaseFactory,
} from '@/application/usecase/accountSetting'
import { ApplicationSettingUseCase } from '@/application/usecase/applicationSetting'
import {
  RepositorySettingUseCase,
  RepositorySettingUseCaseFactory,
} from '@/application/usecase/repositorySetting'
import CommitsView from '@/views/CommitsView.vue'
import CommitHistory from '@/views/commits/CommitHistory.vue'

const githubUrl = GitHubUrl.from('https://github.com')
const account = new Account('name', 'profile', 'avatar', githubUrl!, 'pat')

const MockedApplicationSettingUseCase = vi.fn()
MockedApplicationSettingUseCase.mockImplementation(
  (arr: Array<ApplicationSetting>): ApplicationSettingUseCase => {
    return {
      hasSetting: (_setting: ApplicationSetting) => true,
      getSettings: () => arr,
      addSetting: (_setting: ApplicationSetting) => {},
      removeSetting: (_setting: ApplicationSetting) => {},
    }
  }
)

const MockedAccountSettingUseCase = vi.fn()
MockedAccountSettingUseCase.mockImplementation((): AccountSettingUseCase => {
  return {
    setAccount(_account: Account): void {},
    getAccount(): Account {
      return account
    },
    deleteSetting(): void {},
  }
})

const MockedRepositorySettingUseCase = vi.fn()
MockedRepositorySettingUseCase.mockImplementation(
  (arr: Array<RepositorySetting>): RepositorySettingUseCase => {
    return {
      addRepositorySetting: (_s: RepositorySetting) => true,
      deleteRepositorySetting: (_s: RepositorySetting) => {},
      getRepositorySettings: () => arr,
      setRepositorySettings: (_s: Array<RepositorySetting>) => {},
    }
  }
)
const mockedAccountSettingUseCaseFactory: AccountSettingUseCaseFactory = {
  newAccountSettingUseCase: (_setting: ApplicationSetting): AccountSettingUseCase => {
    return new MockedAccountSettingUseCase()
  },
}

const RepositoryFilterMock = defineComponent({
  name: 'RepositoryFilter',
  methods: {
    isVisible: () => true,
  },
  render: () => h('input', {}, ''),
})

describe('CommitsView.vue', () => {
  it('renders when account is not configured', async () => {
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (_setting: ApplicationSetting) =>
        new MockedRepositorySettingUseCase([]),
    }

    const wrapper = shallowMount(CommitsView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock,
        },
        stubs: {
          RepositoryFilter: RepositoryFilterMock,
        },
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('Account is not configured.')
    expect(wrapper.findAllComponents(CommitHistory)).toHaveLength(0)
  })

  it('renders when no repositories are configured', async () => {
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (_setting: ApplicationSetting) =>
        new MockedRepositorySettingUseCase([]),
    }

    const wrapper = shallowMount(CommitsView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([
            new ApplicationSetting('foo'),
          ]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock,
        },
        stubs: {
          RepositoryFilter: RepositoryFilterMock,
        },
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('No repositories are configured.')
    expect(wrapper.findAllComponents(CommitHistory)).toHaveLength(0)
  })

  it('renders when two repositories are configured', async () => {
    const repository1 = new RepositorySetting('https://github.com/a/b')
    const repository2 = new RepositorySetting('https://github.com/c/d')
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (_setting: ApplicationSetting) =>
        new MockedRepositorySettingUseCase([repository1, repository2]),
    }

    const wrapper = shallowMount(CommitsView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: new MockedApplicationSettingUseCase([
            new ApplicationSetting('foo'),
          ]),
          [RepositorySettingUseCaseFactoryKey as symbol]: repositorySettingUseCaseFactoryMock,
        },
        stubs: {
          RepositoryFilter: RepositoryFilterMock,
        },
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('')
    expect(wrapper.findAllComponents(CommitHistory)).toHaveLength(2)
  })
})
