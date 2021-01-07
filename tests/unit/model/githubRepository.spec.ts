import { expect } from 'chai'
import { RepositoryUrl } from '@/model/githubRepository'

describe('RepositoryUrl', () => {
  it('can initialize', () => {
    const actual = new RepositoryUrl('https://github.com/ytakahashi/test-123_456/')
    expect(actual.isValid()).to.equal(true)
    expect(actual.getUrl()).to.equal('https://github.com/ytakahashi/test-123_456')
    expect(actual.getOwner()).to.equal('ytakahashi')
    expect(actual.getRepositoryName()).to.equal('test-123_456')
    expect(actual.asString()).to.equal('ytakahashi/test-123_456')
  })
})
