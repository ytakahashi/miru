import { expect } from 'chai'
import { GitHubUrl } from '@/model/github'

describe('GitHubUrl', () => {
  it('can initialize', () => {
    const actual = new GitHubUrl()
    expect(actual.url).to.eq('https://github.com')
    expect(actual.isEnterprise()).to.eq(false)
  })
})
