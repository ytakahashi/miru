import { RepositorySetting } from '@/domain/model/githubRepository'

describe('RepositorySetting', () => {
  it('can initialize', () => {
    const actual = new RepositorySetting('https://github.com/ytakahashi/test-123_456/')
    expect(actual.isValid()).toBeTruthy()
    expect(actual.getUrl()).toBe('https://github.com/ytakahashi/test-123_456')
    expect(actual.getOwner()).toBe('ytakahashi')
    expect(actual.getRepositoryName()).toBe('test-123_456')
    expect(actual.displayName()).toBe('ytakahashi/test-123_456')
    expect(actual.displayName('-')).toBe('ytakahashi-test-123_456')
    expect(actual.equals(new RepositorySetting('https://github.com/ytakahashi/test-123_456/'))).toBeTruthy()
    expect(actual.equals(new RepositorySetting('https://github.com/ytakahashi/test-123_45/'))).toBeFalsy()
  })
})
