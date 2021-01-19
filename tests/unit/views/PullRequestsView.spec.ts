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

const account = new Account('name', 'profile', 'avatar', jest.fn<GitHubUrl, []>()(), 'pat')
const MockedApplicationSettingUseCase = jest.fn<ApplicationSettingUseCase, [Array<ApplicationSetting>]>()
const MockedAccountSettingUseCase = jest.fn<AccountSettingUseCase, [Array<RepositoryUrl>]>()

MockedApplicationSettingUseCase.mockImplementation((arr: Array<ApplicationSetting>): ApplicationSettingUseCase => {
  return {
    hasSetting: (setting: ApplicationSetting) => true,
    getSettings: () => arr,
    addSetting: (setting: ApplicationSetting) => {},
    removeSetting: (setting: ApplicationSetting) => {}
  }
})

MockedAccountSettingUseCase.mockImplementation((arr: Array<RepositoryUrl>): AccountSettingUseCase => {
  return {
    addRepositoryUrl (url: RepositoryUrl): void {},
    deleteRepositoryUrl (url: RepositoryUrl): void {},
    getRepositoryUrls (): Array<RepositoryUrl> { return arr },
    setRepositoryUrls (urls: Array<RepositoryUrl>): void {},
    clearRepositoryUrls (): void {},
    setAccount (account: Account): void {},
    getAccount (): Account { return account },
    deleteSetting (): void {}
  }
})

describe('PullRequestView.vue', () => {
  it('renders when account is not configured', async () => {
    const mockedAccountSettingUseCaseFactory: AccountSettingUseCaseFactory = {
      newAccountSettingUseCase: (setting: ApplicationSetting): AccountSettingUseCase => {
        return new MockedAccountSettingUseCase([])
      }
    }

    const wrapper = shallowMount(PullRequestView, {
      props: {
        accountSettingUseCaseFactory: mockedAccountSettingUseCaseFactory,
        applicationSettingUseCase: new MockedApplicationSettingUseCase([])
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('Account is not configured.')
    expect(wrapper.findAllComponents(GitHubPullRequest)).toHaveLength(0)
  })

  it('renders when two repositories are configured', async () => {
    const mockedAccountSettingUseCaseFactory: AccountSettingUseCaseFactory = {
      newAccountSettingUseCase: (setting: ApplicationSetting): AccountSettingUseCase => {
        return new MockedAccountSettingUseCase([new RepositoryUrl('https://github.com/a/b'), new RepositoryUrl('https://github.com/c/d')])
      }
    }
    const wrapper = shallowMount(PullRequestView, {
      props: {
        accountSettingUseCaseFactory: mockedAccountSettingUseCaseFactory,
        applicationSettingUseCase: new MockedApplicationSettingUseCase([new ApplicationSetting('foo')])
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(GitHubPullRequest)).toHaveLength(2)
  })
})
