import { expect } from 'chai'
import { GitHubUrl, Issue } from '@/model/github'

describe('GitHubUrl', () => {
  it('can initialize', () => {
    const actual = new GitHubUrl()
    expect(actual.url).to.eq('https://github.com')
    expect(actual.isEnterprise()).to.eq(false)
  })
})

describe('Issue', () => {
  it('holds parameters', () => {
    const actual = new Issue(
      'issue title',
      'issue url',
      '2020-12-15T21:23:56Z',
      '2021-01-02T23:44:14Z',
      []
    )

    expect(actual.title).to.equal('issue title')
    expect(actual.url).to.equal('issue url')
    expect(actual.getCreatedRelativeDate()).to.match(/ago$/)
    expect(actual.getUpdatedRelativeDate()).to.match(/ago$/)
    expect(actual.labels).to.have.lengthOf(0)
  })
})
