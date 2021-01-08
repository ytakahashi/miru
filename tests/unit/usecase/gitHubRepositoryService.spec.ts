/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { expect } from 'chai'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { GitHubRepositoryService } from '@/usecase/githubRepositoryService'
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
      const sut = new GitHubRepositoryService(mock, 'pat')
      const actual = await sut.getIssues(new RepositoryUrl('https://github.com/ytakahashi/miru'))
      expect(actual.totalCount).to.equal(16)
      expect(actual.issues).to.have.lengthOf(1)

      const actualIssue = actual.issues[0]
      expect(actualIssue.authorName).to.equal('ytakahashi')
      expect(actualIssue.issueNumber).to.equal(1294)
      expect(actualIssue.title).to.equal('Issue Title')
      expect(actualIssue.url).to.equal('https://github.com/ytakahashi/miru/issues/1294')
      expect(actualIssue.createdAt).to.equal('2020-12-12T19:04:12Z')
      expect(actualIssue.updatedAt).to.equal('2021-01-07T07:44:22Z')
      expect(actualIssue.labels).to.have.length(2)
      expect(actualIssue.numberOfComments).to.equal(16)
      expect(actualIssue.numberOfParticipants).to.equal(5)
    })
  })

  describe('getPullRequests method', () => {
    it('returns pull requests', async () => {
      const sut = new GitHubRepositoryService(mock, 'pat')
      const actual = await sut.getPullRequests(new RepositoryUrl('https://github.com/ytakahashi/miru'))
      expect(actual.totalCount).to.equal(7)
      expect(actual.pullRequests).to.have.lengthOf(1)

      const actualPullRequest = actual.pullRequests[0]
      expect(actualPullRequest.issueNumber).to.equal(7775)
      expect(actualPullRequest.authorName).to.equal('ytakahashi')
      expect(actualPullRequest.title).to.equal('pull request title')
      expect(actualPullRequest.url).to.equal('https://github.com/ytakahashi/miru/pull/7775')
      expect(actualPullRequest.createdAt).to.equal('2021-01-01T09:58:25Z')
      expect(actualPullRequest.updatedAt).to.equal('2021-01-08T02:03:10Z')
      expect(actualPullRequest.labels).to.have.length(0)
      expect(actualPullRequest.numberOfComments).to.equal(4)
      expect(actualPullRequest.numberOfParticipants).to.equal(6)
      expect(actualPullRequest.additions).to.equal(374)
      expect(actualPullRequest.deletions).to.equal(42)
      expect(actualPullRequest.changedFiles).to.equal(6)
      expect(actualPullRequest.isDraft).to.equal(false)
    })
  })
})
