import { expect } from 'chai'
import { GitHubUrl, Issue } from '@/domain/model/github'

describe('GitHubUrl', () => {
  it('can initialize (empty)', () => {
    const actual = GitHubUrl.from('')
    if (actual === undefined) {
      expect.fail()
    }
    expect(actual).to.not.be.an('undefined')
    expect(actual.getUrl()).to.equal('https://github.com')
    expect(actual.getApiEndpoint()).to.equal('https://api.github.com/graphql')
    expect(actual.getDomain()).to.equal('github.com')
    expect(actual.isEnterprise()).to.equal(false)
  })

  it('can initialize (undefined)', () => {
    const actual = GitHubUrl.from()
    if (actual === undefined) {
      expect.fail()
    }
    expect(actual).to.not.be.an('undefined')
    expect(actual.getUrl()).to.equal('https://github.com')
    expect(actual.getApiEndpoint()).to.equal('https://api.github.com/graphql')
    expect(actual.getDomain()).to.equal('github.com')
    expect(actual.isEnterprise()).to.equal(false)
  })

  it('cant initialize', () => {
    const actual = GitHubUrl.from('a')
    expect(actual).to.equal(undefined)
  })

  it('can initialize enterprize url', () => {
    const actual = GitHubUrl.from('https://github.test.enterprise.com/')
    if (actual === undefined) {
      expect.fail()
    }
    expect(actual.getUrl()).to.equal('https://github.test.enterprise.com')
    expect(actual.getApiEndpoint()).to.equal('https://github.test.enterprise.com/api/graphql')
    expect(actual.getDomain()).to.equal('github.test.enterprise.com')
    expect(actual.isEnterprise()).to.equal(true)
  })
})

describe('Issue', () => {
  it('holds parameters', () => {
    const actual = new Issue(
      'author',
      123,
      'issue title',
      'issue url',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      [],
      2,
      3
    )

    expect(actual.title).to.equal('issue title')
    expect(actual.url).to.equal('issue url')
    expect(actual.getCreatedRelativeDate()).to.match(/ago$/)
    expect(actual.getUpdatedRelativeDate()).to.match(/ago$/)
    expect(actual.labels).to.have.lengthOf(0)
  })
})
