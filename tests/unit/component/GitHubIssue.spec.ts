import { shallowMount } from '@vue/test-utils'
import GitHubIssue from '@/components/GitHubIssue.vue'
import IssueContent from '@/components/IssueContent.vue'
import { Issue, Issues, PullRequests } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { GitHubRepositoryUseCase } from '@/usecase/githubRepository'

const MockedPullRequests = jest.fn<PullRequests, []>()

const MockedGitHubRepositoryUseCase = jest.fn<GitHubRepositoryUseCase, [Issues]>()
MockedGitHubRepositoryUseCase.mockImplementation((issues: Issues): GitHubRepositoryUseCase => {
  return {
    getIssues: async (): Promise<Issues> => issues,
    getPullRequests: async (): Promise<PullRequests> => new MockedPullRequests()
  }
})

const url = new RepositoryUrl('https://github.com/ytakahashi/miru')

describe('GitHubIssue.vue', () => {
  it('renders when open issue does not exist', async () => {
    const issues = new Issues(url, [], 0)
    const wrapper = shallowMount(GitHubIssue, {
      props: {
        repositoryUrl: url,
        githubRepositoryUseCase: new MockedGitHubRepositoryUseCase(issues)
      }
    })
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).toContain('There aren’t any open issues.')
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(0)
  })

  it('renders when 2 open PRs exist', async () => {
    const issue1 = new Issue(
      'author 1',
      123,
      'issue title 1',
      'issue url 1',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      [],
      2,
      3
    )
    const issue2 = new Issue(
      'author 2',
      124,
      'issue title 2',
      'issue url 2',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      [],
      2,
      3
    )
    const issues = new Issues(url, [issue1, issue2], 2)
    const wrapper = shallowMount(GitHubIssue, {
      props: {
        repositoryUrl: url,
        githubRepositoryUseCase: new MockedGitHubRepositoryUseCase(issues)
      }
    })
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('ytakahashi/miru')
    expect(wrapper.text()).not.toContain('There aren’t any open issues.')
    expect(wrapper.findAllComponents(IssueContent)).toHaveLength(2)
  })
})
