import { Release, Releases } from '@/application/domain/model/github.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'
import { getters, mutations } from '@/store/releases.js'

const setting1 = new RepositorySetting('https://github.com/foo/test1')
const setting2 = new RepositorySetting('https://github.com/foo/test2')
const setting3 = new RepositorySetting('https://github.com/foo/test3')

const release1 = new Releases(setting1, [], 1)
const release2 = new Releases(setting2, [], 1)
const release3 = new Releases(setting3, [], 1)
const release = (url: string): Release =>
  new Release('author', 'name', url, '', '', false, false, 0)

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
    it('appends results to an existing repository', () => {
      const current = new Releases(setting1, [release('release-1')], 3)
      mutations.replace(current)
      const before = getters.of(setting1)

      mutations.append(new Releases(setting1, [release('release-2')], 3))

      expect(getters.of(setting1)?.results.map(result => result.url)).toEqual([
        'release-1',
        'release-2',
      ])
      expect(getters.of(setting1)).not.toBe(before)
    })

    it('adds results when the repository has no entry', () => {
      const setting4 = new RepositorySetting('https://github.com/foo/test4')
      const next = new Releases(setting4, [release('release-1')], 1)

      mutations.append(next)

      expect(getters.of(setting4)?.results.map(result => result.url)).toEqual(['release-1'])
      expect(getters.of(setting4)?.totalCount).toBe(1)
    })

    it('does not change other repositories when appending', () => {
      const other = getters.of(setting2)
      const third = getters.of(setting3)
      mutations.replace(new Releases(setting1, [release('release-1')], 2))

      mutations.append(new Releases(setting1, [release('release-2')], 2))

      expect(getters.of(setting2)).toBe(other)
      expect(getters.of(setting3)).toBe(third)
    })

    it('propagates concat errors without changing the existing entry', () => {
      mutations.replace(new Releases(setting1, [release('release-1')], 2, undefined, { count: 10 }))
      const before = getters.of(setting1)

      expect(() =>
        mutations.append(
          new Releases(setting1, [release('release-2')], 2, undefined, { count: 20 })
        )
      ).toThrow('Cannot concatenate results fetched with different query conditions.')

      expect(getters.of(setting1)).toBe(before)
      expect(getters.of(setting1)?.results.map(result => result.url)).toEqual(['release-1'])
    })

    it('replaces releases', () => {
      const before = getters.of(setting1)
      const newReleases1 = new Releases(setting1, [], 1)
      mutations.replace(newReleases1)

      const actual = getters.of(setting1)
      expect(actual).not.toBe(before)
      expect(actual).toBe(newReleases1)
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
