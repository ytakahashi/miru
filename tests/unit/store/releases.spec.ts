import { Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { getters, mutations } from '@/store/releases'

const MockedReleases = jest.fn<Releases, [RepositorySetting]>()
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
    hasContents: (): boolean => true
  }
})

const setting1 = new RepositorySetting('https://github.com/foo/test1')
const setting2 = new RepositorySetting('https://github.com/foo/test2')
const setting3 = new RepositorySetting('https://github.com/foo/test3')

const issues1 = new MockedReleases(setting1)
const issues2 = new MockedReleases(setting2)
const issues3 = new MockedReleases(setting3)

beforeAll(() => {
  mutations.add([issues1, issues2, issues3])
})

afterAll(() => {
  mutations.clear()
})

describe('releases store', () => {
  describe('getters', () => {
    it('returns releases', () => {
      const actual = getters.of(setting1)
      expect(actual).toStrictEqual(issues1)
    })
  })

  describe('mutations', () => {
    it('replaces releases', () => {
      const newReleases1 = new MockedReleases(setting1)
      mutations.replace(newReleases1)

      const actual = getters.of(setting1)
      expect(actual).not.toStrictEqual(issues1)
      expect(actual).toStrictEqual(newReleases1)
    })
  })
})
