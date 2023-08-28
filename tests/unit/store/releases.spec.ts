import { vi } from 'vitest'
import { Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { getters, mutations } from '@/store/releases'

const MockedReleases = vi.fn()
MockedReleases.mockImplementation((s: RepositorySetting): Releases => {
  return {
    fetchedAt: 1,
    repositoryUrl: s.getUrl(),
    results: [],
    totalCount: 1,
    fetchedAtDate: () => '',
    belongsTo: (r: string): boolean => {
      return s.getUrl() === r
    },
    hasContents: (): boolean => true,
  }
})

const setting1 = new RepositorySetting('https://github.com/foo/test1')
const setting2 = new RepositorySetting('https://github.com/foo/test2')
const setting3 = new RepositorySetting('https://github.com/foo/test3')

const release1 = new MockedReleases(setting1)
const release2 = new MockedReleases(setting2)
const release3 = new MockedReleases(setting3)

beforeEach(() => {
  mutations.add([release1, release2, release3])
})

afterEach(() => {
  mutations.clear()
})

describe('releases store', () => {
  describe('getters', () => {
    it('returns releases', () => {
      const actual = getters.of(setting1)
      expect(actual).toStrictEqual(release1)
    })
  })

  describe('mutations', () => {
    it('replaces releases', () => {
      const newReleases1 = new MockedReleases(setting1)
      mutations.replace(newReleases1)

      const actual = getters.of(setting1)
      expect(actual).not.toStrictEqual(release1)
      expect(actual).toStrictEqual(newReleases1)
    })

    it('removes release', () => {
      let actual1 = getters.of(setting1)
      expect(actual1).toStrictEqual(release1)

      mutations.remove(setting1)
      actual1 = getters.of(setting1)
      expect(actual1).not.toBeDefined()
    })
  })
})
