import { shallowMount } from '@vue/test-utils'
import GitHubPullRequest from '@/components/GitHubPullRequest.vue'
import PullRequestContent from '@/components/PullRequestContent.vue'
import { Issues, PullRequest, PullRequests } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { GitHubRepositoryUseCase } from '@/usecase/githubRepository'

const MockedIssues = jest.fn<Issues, []>()

const MockedGitHubRepositoryUseCase = jest.fn<GitHubRepositoryUseCase, [PullRequests]>()
MockedGitHubRepositoryUseCase.mockImplementation((pr: PullRequests): GitHubRepositoryUseCase => {
  return {
    getIssues: async (): Promise<Issues> => new MockedIssues(),
    getPullRequests: async (): Promise<PullRequests> => pr
  }
})

const url = new RepositoryUrl('https://github.com/ytakahashi/miru')

describe('GitHubPullRequest.vue', () => {
  it('renders when open PR does not exist', async () => {
    const pullRequests = new PullRequests(url, [], 0)
    const wrapper = shallowMount(GitHubPullRequest, {
      props: {
        repositoryUrl: url,
        githubRepositoryUseCase: new MockedGitHubRepositoryUseCase(pullRequests)
      }
    })
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).toContain('There aren’t any open pull requests.')
    expect(wrapper.findAllComponents(PullRequestContent)).toHaveLength(0)
  })

  it('renders when 2 open PRs exist', async () => {
    const pr1 = new PullRequest(
      'author 1',
      123,
      'pr title 1',
      'pr url 1',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      [],
      2,
      3,
      123,
      456,
      7,
      true
    )
    const pr2 = new PullRequest(
      'author 2',
      124,
      'pr title 2',
      'pr url 2',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      [],
      2,
      3,
      234,
      567,
      8,
      true
    )
    const pullRequests = new PullRequests(url, [pr1, pr2], 2)
    const wrapper = shallowMount(GitHubPullRequest, {
      props: {
        repositoryUrl: url,
        githubRepositoryUseCase: new MockedGitHubRepositoryUseCase(pullRequests)
      }
    })
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).not.toContain('There aren’t any open pull requests.')
    expect(wrapper.findAllComponents(PullRequestContent)).toHaveLength(2)
  })
})
