import { RepositoryUrl } from '@/domain/model/githubRepository'

describe('RepositoryUrl', () => {
  it('can initialize', () => {
    const actual = new RepositoryUrl('https://github.com/ytakahashi/test-123_456/')
    expect(actual.isValid()).toBeTruthy()
    expect(actual.getUrl()).toBe('https://github.com/ytakahashi/test-123_456')
    expect(actual.getOwner()).toBe('ytakahashi')
    expect(actual.getRepositoryName()).toBe('test-123_456')
    expect(actual.asString()).toBe('ytakahashi/test-123_456')
  })
})
