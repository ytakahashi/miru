/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { shallowMount } from '@vue/test-utils'
import GitHubPullRequest from '@/components/GitHubPullRequest.vue'
import PullRequestView from '@/views/PullRequestsView.vue'
import { ApplicationSetting } from '@/domain/model/application'
import { Account, GitHubUrl } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
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

const MockedRepositorySettingUseCase = jest.fn<RepositorySettingUseCase, [Array<RepositoryUrl>]>()
MockedRepositorySettingUseCase.mockImplementation((arr: Array<RepositoryUrl>): RepositorySettingUseCase => {
  return {
    addRepositoryUrl: (url: RepositoryUrl) => {},
    deleteRepositoryUrl: (url: RepositoryUrl) => {},
    getRepositoryUrls: () => arr,
    setRepositoryUrls: (urls: Array<RepositoryUrl>) => {}
  }
})

describe('PullRequestView.vue', () => {
  it('renders when account is not configured', async () => {
    const mockedAccountSettingUseCaseFactory: AccountSettingUseCaseFactory = {
      newAccountSettingUseCase: (setting: ApplicationSetting): AccountSettingUseCase => {
        return new MockedAccountSettingUseCase()
      }
    }
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (setting: ApplicationSetting) => new MockedRepositorySettingUseCase([])
    }

    const wrapper = shallowMount(PullRequestView, {
      props: {
        accountSettingUseCaseFactory: mockedAccountSettingUseCaseFactory,
        applicationSettingUseCase: new MockedApplicationSettingUseCase([]),
        repositorySettingUseCaseFactory: repositorySettingUseCaseFactoryMock
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('Account is not configured.')
    expect(wrapper.findAllComponents(GitHubPullRequest)).toHaveLength(0)
  })

  it('renders when two repositories are configured', async () => {
    const mockedAccountSettingUseCaseFactory: AccountSettingUseCaseFactory = {
      newAccountSettingUseCase: (setting: ApplicationSetting): AccountSettingUseCase => {
        return new MockedAccountSettingUseCase()
      }
    }
    const repositorySettingUseCaseFactoryMock: RepositorySettingUseCaseFactory = {
      newRepositorySettingUseCase: (setting: ApplicationSetting) =>
        new MockedRepositorySettingUseCase(
          [new RepositoryUrl('https://github.com/a/b'), new RepositoryUrl('https://github.com/c/d')]
        )
    }

    const wrapper = shallowMount(PullRequestView, {
      props: {
        accountSettingUseCaseFactory: mockedAccountSettingUseCaseFactory,
        applicationSettingUseCase: new MockedApplicationSettingUseCase([new ApplicationSetting('foo')]),
        repositorySettingUseCaseFactory: repositorySettingUseCaseFactoryMock
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(GitHubPullRequest)).toHaveLength(2)
  })
})
