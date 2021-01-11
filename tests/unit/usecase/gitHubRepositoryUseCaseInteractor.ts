/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { GitHubRepositoryUseCaseInteractor } from '@/usecase/interactor/githubRepositoryUseCaseInteractor'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { IssueConnection, PullRequestConnection, Viewer } from '@/infrastructure/dto/githubApi'

describe('GitHubRepositoryService class', () => {
  const viewer: Viewer = require('../resources/viewer.json')
  const issueConnection: IssueConnection = require('../resources/issues.json')
  const pullRequestConnection: PullRequestConnection = require('../resources/pull-requests.json')

  const mock: GitHubAccessor = {
    async getViewer (personalAccessToken: string): Promise<Viewer> {
      return viewer
    },
    async getIssues (personalAccessToken: string, url: RepositoryUrl): Promise<IssueConnection> {
      return issueConnection
    },
    async getPullRequests (personalAccessToken: string, url: RepositoryUrl): Promise<PullRequestConnection> {
      return pullRequestConnection
    }
  }

  describe('getIssues method', () => {
    it('returns issues', async () => {
      const sut = new GitHubRepositoryUseCaseInteractor(mock, 'pat')
      const actual = await sut.getIssues(new RepositoryUrl('https://github.com/ytakahashi/miru'))
      expect(actual.totalCount).toBe(16)
      expect(actual.issues).toHaveLength(1)

      const actualIssue = actual.issues[0]
      expect(actualIssue.authorName).toBe('ytakahashi')
      expect(actualIssue.issueNumber).toBe(1294)
      expect(actualIssue.title).toBe('Issue Title')
      expect(actualIssue.url).toBe('https://github.com/ytakahashi/miru/issues/1294')
      expect(actualIssue.createdAt).toBe('2020-12-12T19:04:12Z')
      expect(actualIssue.updatedAt).toBe('2021-01-07T07:44:22Z')
      expect(actualIssue.labels).toHaveLength(2)
      expect(actualIssue.numberOfComments).toBe(16)
      expect(actualIssue.numberOfParticipants).toBe(5)
    })
  })

  describe('getPullRequests method', () => {
    it('returns pull requests', async () => {
      const sut = new GitHubRepositoryUseCaseInteractor(mock, 'pat')
      const actual = await sut.getPullRequests(new RepositoryUrl('https://github.com/ytakahashi/miru'))
      expect(actual.totalCount).toBe(7)
      expect(actual.pullRequests).toHaveLength(1)

      const actualPullRequest = actual.pullRequests[0]
      expect(actualPullRequest.issueNumber).toBe(7775)
      expect(actualPullRequest.authorName).toBe('ytakahashi')
      expect(actualPullRequest.title).toBe('pull request title')
      expect(actualPullRequest.url).toBe('https://github.com/ytakahashi/miru/pull/7775')
      expect(actualPullRequest.createdAt).toBe('2021-01-01T09:58:25Z')
      expect(actualPullRequest.updatedAt).toBe('2021-01-08T02:03:10Z')
      expect(actualPullRequest.labels).toHaveLength(0)
      expect(actualPullRequest.numberOfComments).toBe(4)
      expect(actualPullRequest.numberOfParticipants).toBe(6)
      expect(actualPullRequest.additions).toBe(374)
      expect(actualPullRequest.deletions).toBe(42)
      expect(actualPullRequest.changedFiles).toBe(6)
      expect(actualPullRequest.isDraft).toBeFalsy()
    })
  })
})
