/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GitHubAccessor } from '@/application/domain/interface/githubAccessor'
import { GitHubRepositoryUseCaseInteractor } from '@/application/usecase/interactor/githubRepositoryUseCaseInteractor'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { IssueConnection, PullRequestConnection, ReleaseConnection, Viewer } from '@/application/infrastructure/dto/githubApi'

describe('GitHubRepositoryUseCaseInteractor class', () => {
  const viewer: Viewer = require('../../resources/viewer.json')
  const issueConnection: IssueConnection = require('../../resources/issues.json')
  const pullRequestConnection: PullRequestConnection = require('../../resources/pull-requests.json')
  const releaseConnection: ReleaseConnection = require('../../resources/releases.json')

  const mock: GitHubAccessor = {
    async getViewer (personalAccessToken: string): Promise<Viewer> {
      return viewer
    },
    async getIssues (personalAccessToken: string, s: RepositorySetting): Promise<IssueConnection> {
      return issueConnection
    },
    async getPullRequests (personalAccessToken: string, s: RepositorySetting): Promise<PullRequestConnection> {
      return pullRequestConnection
    },
    async getReleases (personalAccessToken: string, s: RepositorySetting): Promise<ReleaseConnection> {
      return releaseConnection
    }
  }

  describe('getIssues method', () => {
    it('returns issues', async () => {
      const sut = new GitHubRepositoryUseCaseInteractor(mock, 'pat')
      const target = new RepositorySetting('https://github.com/ytakahashi/miru')
      const actual = await sut.getIssues(target)
      expect(actual.totalCount).toBe(16)
      expect(actual.results).toHaveLength(1)
      expect(actual.belongsTo('https://github.com/ytakahashi/miru')).toBe(true)
      expect(actual.hasContents()).toBeTruthy()
      expect(actual.fetchedAtDate()).not.toBeUndefined()

      const actualIssue = actual.results[0]
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
      const target = new RepositorySetting('https://github.com/ytakahashi/miru')
      const actual = await sut.getPullRequests(target)
      expect(actual.totalCount).toBe(7)
      expect(actual.results).toHaveLength(1)
      expect(actual.belongsTo('https://github.com/ytakahashi/miru')).toBe(true)
      expect(actual.hasContents()).toBeTruthy()
      expect(actual.fetchedAtDate()).not.toBeUndefined()

      const actualPullRequest = actual.results[0]
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

  describe('getReleases method', () => {
    it('returns releases', async () => {
      const sut = new GitHubRepositoryUseCaseInteractor(mock, 'pat')
      const target = new RepositorySetting('https://github.com/ytakahashi/miru')
      const actual = await sut.getReleases(target)
      expect(actual.totalCount).toBe(2)
      expect(actual.results).toHaveLength(2)
      expect(actual.belongsTo('https://github.com/ytakahashi/miru')).toBe(true)
      expect(actual.hasContents()).toBe(true)
      expect(actual.fetchedAtDate()).not.toBeUndefined()

      const actualRelease0 = actual.results[0]
      expect(actualRelease0.authorName).toBe('github-actions[bot]')
      expect(actualRelease0.title).toBe('v0.2.0')
      expect(actualRelease0.url).toBe('https://github.com/ytakahashi/miru/releases/tag/v0.2.0')
      expect(actualRelease0.createdAt).toBe('2021-01-24T04:41:25Z')
      expect(actualRelease0.updatedAt).toBe('2021-01-24T04:41:25Z')
      expect(actualRelease0.isDraft).toBe(false)
      expect(actualRelease0.isPrerelease).toBe(false)
      expect(actualRelease0.releaseAssetCount).toBe(4)
      expect(actualRelease0.tagName).toBe('v0.2.0')
      expect(actualRelease0.tag).toBeDefined()
      expect(actualRelease0.tag?.abbreviatedObjectId).toBe('e6e7ac5')
      expect(actualRelease0.tag?.commitUrl).toBe('https://github.com/ytakahashi/miru/commit/893093edc0849de20763d1858d84a7bcb02ca07b')
    })
  })
})
