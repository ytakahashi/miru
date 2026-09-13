import {
  Commit,
  CommitHistory,
  GitHubUrl,
  Issue,
  Issues,
  Label,
  PageInfo,
  PullRequest,
  PullRequestReviews,
  PullRequests,
  Release,
  Releases,
} from '@/application/domain/model/github.js'
import type { Option } from '@/application/domain/interface/githubAccessor.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'

const createIssue = (url: string): Issue =>
  new Issue('author', 'title', url, '', '', 1, [], 0, 0, false, false, 'OPEN')

const createPullRequest = (url: string): PullRequest =>
  new PullRequest(
    'author',
    'title',
    url,
    '',
    '',
    1,
    [],
    0,
    0,
    0,
    0,
    0,
    false,
    new PullRequestReviews(0, false),
    false,
    false,
    false,
    'OPEN'
  )

const createRelease = (url: string): Release =>
  new Release('author', 'name', url, '', '', false, false, 0)

const createCommit = (url: string): Commit => new Commit('message', url, 0, 0, 0, '', '', '', '')

describe('GitHubUrl', () => {
  it('can initialize (empty)', () => {
    const actual = GitHubUrl.from('')
    if (actual === undefined) {
      throw new Error('failed')
    }
    expect(actual).not.toBeUndefined()
    expect(actual.getUrl()).toBe('https://github.com')
    expect(actual.getApiEndpoint()).toBe('https://api.github.com/graphql')
    expect(actual.getDomain()).toBe('github.com')
    expect(actual.isEnterprise()).toBeFalsy()
  })

  it('can initialize (undefined)', () => {
    const actual = GitHubUrl.from()
    if (actual === undefined) {
      throw new Error('failed')
    }
    expect(actual).not.toBeUndefined()
    expect(actual.getUrl()).toBe('https://github.com')
    expect(actual.getApiEndpoint()).toBe('https://api.github.com/graphql')
    expect(actual.getDomain()).toBe('github.com')
    expect(actual.isEnterprise()).toBeFalsy()
  })

  it('cant initialize', () => {
    const actual = GitHubUrl.from('a')
    expect(actual).toBeUndefined()
  })

  it('can initialize enterprize url', () => {
    const actual = GitHubUrl.from('https://github.test.enterprise.com/')
    if (actual === undefined) {
      throw new Error('failed')
    }
    expect(actual.getUrl()).toBe('https://github.test.enterprise.com')
    expect(actual.getApiEndpoint()).toBe('https://github.test.enterprise.com/api/graphql')
    expect(actual.getDomain()).toBe('github.test.enterprise.com')
    expect(actual.isEnterprise()).toBeTruthy()
  })
})

describe('Label class', () => {
  it('can initialize', () => {
    const actual = new Label('test1', '2B3196')
    expect(actual.name).toBe('test1')
    expect(actual.color).toBe('#2b3196')
    expect(actual.isLight).toBe(false)
  })
})

describe('Issue', () => {
  it('holds parameters', () => {
    const actual = new Issue(
      'author',
      'issue title',
      'issue url',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [],
      2,
      3,
      false,
      false,
      'OPEN'
    )

    expect(actual.title).toBe('issue title')
    expect(actual.url).toBe('issue url')
    expect(actual.getCreatedRelativeDate()).toMatch(/ago$/)
    expect(actual.getCreatedLocalDate()).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    expect(actual.getUpdatedRelativeDate()).toMatch(/ago$/)
    expect(actual.getUpdatedLocalDate()).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    expect(actual.isAssigned).toBe(false)
    expect(actual.viewerDidAuthor).toBe(false)
    expect(actual.labels).toHaveLength(0)
    expect(actual.state).toBe('OPEN')
  })
})

describe('PullRequest', () => {
  it('holds parameters', () => {
    const actual = new PullRequest(
      'author',
      'pr title',
      'pr url',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      123,
      [],
      2,
      3,
      100,
      10,
      1,
      false,
      new PullRequestReviews(10, false),
      false,
      false,
      true,
      'OPEN',
      'SUCCESS'
    )

    expect(actual.title).toBe('pr title')
    expect(actual.url).toBe('pr url')
    expect(actual.getCreatedRelativeDate()).toMatch(/ago$/)
    expect(actual.getCreatedLocalDate()).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    expect(actual.getUpdatedRelativeDate()).toMatch(/ago$/)
    expect(actual.getUpdatedLocalDate()).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    expect(actual.isAssigned).toBe(false)
    expect(actual.viewerDidAuthor).toBe(true)
    expect(actual.isDraft).toBe(false)
    expect(actual.isReviewRequested).toBe(false)
    expect(actual.labels).toHaveLength(0)
    expect(actual.state).toBe('OPEN')
    expect(actual.status).toBe('SUCCESS')
  })
})

describe('Issues', () => {
  it('holds parameters and all methods work', () => {
    const setting = new RepositorySetting('https://github.com/facebook/jest')
    const actual = new Issues(setting, [], 0)

    expect(actual.repositoryUrl).toBe('https://github.com/facebook/jest')
    expect(actual.results).toHaveLength(0)
    expect(actual.totalCount).toEqual(0)
    expect(actual.fetchedAtDate()).toMatch(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/)
    expect(actual.belongsTo('https://github.com/facebook/jest')).toBe(true)
    expect(actual.belongsTo('https://github.com/foo/bar')).toBe(false)
    expect(actual.hasContents()).toBe(false)
  })
})

describe('Commit', () => {
  const sut = new Commit(
    'commit message',
    'https://example.com/commits/1',
    100,
    50,
    3,
    'ytakahashi',
    '2021-03-13T00:00:00Z',
    'ytakahashi',
    '2021-03-13T00:00:01Z',
    'SUCCESS'
  )
  it('holds parameters and all methods work', () => {
    expect(sut.getAuthoredLocalDate()).not.toBe(undefined)
    expect(sut.getCommittedLocalDate()).not.toBe(undefined)
    expect(sut.getAuthorInformation()).toMatch(/^ytakahashi authored .+ ago$/)
    expect(sut.getCommitInformation()).toMatch(/^ytakahashi committed .+ ago$/)
    expect(sut.status).toBe('SUCCESS')
  })
})

describe('ResultListHolder paging', () => {
  const setting = new RepositorySetting('https://github.com/ytakahashi/miru')

  it('returns the next page option with a snapshot of the original conditions', () => {
    const option: Option = {
      count: 10,
      sortField: 'UPDATED_AT',
      sortDirection: 'DESC',
      states: ['OPEN'],
      after: 'previous-cursor',
    }
    const sut = new Issues(setting, [], 1, new PageInfo(true, 'next-cursor'), option)

    option.count = 20
    option.states?.push('CLOSED')

    expect(sut.hasNextPage()).toBe(true)
    expect(sut.nextPageOption()).toEqual({
      count: 10,
      sortField: 'UPDATED_AT',
      sortDirection: 'DESC',
      states: ['OPEN'],
      after: 'next-cursor',
    })
  })

  it('does not expose a next page without a cursor', () => {
    const sut = new Issues(setting, [], 1, new PageInfo(true))

    expect(sut.hasNextPage()).toBe(false)
    expect(sut.nextPageOption()).toBeUndefined()
  })

  it('concatenates issues and removes duplicate results', () => {
    const option: Option = { count: 2, states: ['OPEN'] }
    const current = new Issues(
      setting,
      [createIssue('issue-1')],
      4,
      new PageInfo(true, 'cursor-1'),
      option
    )
    const next = new Issues(
      setting,
      [createIssue('issue-1'), createIssue('issue-2'), createIssue('issue-2')],
      3,
      new PageInfo(true, 'cursor-2'),
      { ...option, after: 'cursor-1' }
    )

    const actual = current.concat(next)

    expect(actual.results.map(issue => issue.url)).toEqual(['issue-1', 'issue-2'])
    expect(actual.totalCount).toBe(3)
    expect(actual.pageInfo.endCursor).toBe('cursor-2')
    expect(actual.nextPageOption()).toEqual({ ...option, after: 'cursor-2' })
  })

  it('rejects results from a different repository', () => {
    const current = new Issues(setting, [], 0)
    const next = new Issues(new RepositorySetting('https://github.com/facebook/jest'), [], 0)

    expect(() => current.concat(next)).toThrow('different repositories')
  })

  it('rejects results fetched with different query conditions', () => {
    const current = new Issues(setting, [], 0, PageInfo.noNextPage, { count: 10 })
    const next = new Issues(setting, [], 0, PageInfo.noNextPage, { count: 20 })

    expect(() => current.concat(next)).toThrow('different query conditions')
  })

  it('concatenates pull requests by URL', () => {
    const current = new PullRequests(setting, [createPullRequest('pull-request-1')])
    const next = new PullRequests(setting, [createPullRequest('pull-request-2')])

    expect(current.concat(next).results.map(pullRequest => pullRequest.url)).toEqual([
      'pull-request-1',
      'pull-request-2',
    ])
  })

  it('concatenates releases by URL', () => {
    const current = new Releases(setting, [createRelease('release-1')])
    const next = new Releases(setting, [createRelease('release-2')])

    expect(current.concat(next).results.map(release => release.url)).toEqual([
      'release-1',
      'release-2',
    ])
  })

  it('concatenates commits by commit URL', () => {
    const current = new CommitHistory(setting, [createCommit('commit-1')])
    const next = new CommitHistory(setting, [createCommit('commit-2')])

    expect(current.concat(next).results.map(commit => commit.commitUrl)).toEqual([
      'commit-1',
      'commit-2',
    ])
  })
})
