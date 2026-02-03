import { ApplicationSetting } from '@/application/domain/model/application'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import {
  AccountSettingUseCaseFactoryKey,
  ApplicationSettingUseCaseKey,
  RepositorySettingUseCaseFactoryKey,
} from '@/plugins/di/types'
import CommitsView from '@/views/CommitsView.vue'
import CommitHistory from '@/views/commits/CommitHistory.vue'
import { shallowMount } from '@vue/test-utils'
import { vi } from 'vitest'
import { defineComponent, h } from 'vue'

import {
  createMockAccountSettingUseCaseFactory,
  createMockApplicationSettingUseCase,
  createMockRepositorySettingUseCaseFactory,
  createMockRepositorySettingUseCase,
} from '../helper/mockFactory'

const mockedAccountSettingUseCaseFactory = createMockAccountSettingUseCaseFactory()

const RepositoryFilterMock = defineComponent({
  name: 'RepositoryFilter',
  methods: {
    isVisible: () => true,
  },
  render: () => h('input', {}, ''),
})

// logger mock
vi.mock('@/application/core/logger', () => ({
  logger: vi.fn(),
}))

describe('CommitsView.vue', () => {
  it('renders when account is not configured', async () => {
    const repositorySettingUseCaseFactoryMock = createMockRepositorySettingUseCaseFactory(
      createMockRepositorySettingUseCase([])
    )

    const wrapper = shallowMount(CommitsView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: createMockApplicationSettingUseCase([]),
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
    const repositorySettingUseCaseFactoryMock = createMockRepositorySettingUseCaseFactory(
      createMockRepositorySettingUseCase([])
    )

    const wrapper = shallowMount(CommitsView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: createMockApplicationSettingUseCase([
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
    const repositorySettingUseCaseFactoryMock = createMockRepositorySettingUseCaseFactory(
      createMockRepositorySettingUseCase([repository1, repository2])
    )

    const wrapper = shallowMount(CommitsView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: createMockApplicationSettingUseCase([
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
    expect(wrapper.text()).toBe('default')
    expect(wrapper.findAllComponents(CommitHistory)).toHaveLength(2)
  })

  it('renders when two categories are configured', async () => {
    const repository1 = new RepositorySetting('https://github.com/a/b')
    const repository2 = new RepositorySetting('https://github.com/c/d')
    repository1.setCategory('category1')
    repository2.setCategory('category2')
    const repositorySettingUseCaseFactoryMock = createMockRepositorySettingUseCaseFactory(
      createMockRepositorySettingUseCase([repository1, repository2])
    )

    const wrapper = shallowMount(CommitsView, {
      global: {
        provide: {
          [AccountSettingUseCaseFactoryKey as symbol]: mockedAccountSettingUseCaseFactory,
          [ApplicationSettingUseCaseKey as symbol]: createMockApplicationSettingUseCase([
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
    expect(wrapper.text()).toBe('category1 category2')
    expect(wrapper.findAllComponents(CommitHistory)).toHaveLength(2)
  })
})
