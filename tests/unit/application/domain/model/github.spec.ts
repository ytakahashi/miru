import { Commit, GitHubUrl, Issue, Issues, Label } from '@/application/domain/model/github.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'

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
    '2021-03-13T00:00:01Z'
  )
  it('holds parameters and all methods work', () => {
    expect(sut.getAuthoredLocalDate()).not.toBe(undefined)
    expect(sut.getCommittedLocalDate()).not.toBe(undefined)
    expect(sut.getAuthorInformation()).toMatch(/^ytakahashi authored .+ ago$/)
    expect(sut.getCommitInformation()).toMatch(/^ytakahashi committed .+ ago$/)
  })
})
