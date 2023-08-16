import { Issues } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { getters, mutations } from '@/store/issues'

const MockedIssues = jest.fn<Issues, [RepositorySetting]>()
MockedIssues.mockImplementation((s: RepositorySetting): Issues => {
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

const issues1 = new MockedIssues(setting1)
const issues2 = new MockedIssues(setting2)
const issues3 = new MockedIssues(setting3)

beforeEach(() => {
  mutations.add([issues1, issues2, issues3])
})

afterEach(() => {
  mutations.clear()
})

describe('issue store', () => {
  describe('getters', () => {
    it('returns issue', () => {
      const actual = getters.of(setting1)
      expect(actual).toStrictEqual(issues1)
    })
  })

  describe('mutations', () => {
    it('replaces issue', () => {
      const newIssues1 = new MockedIssues(setting1)
      mutations.replace(newIssues1)

      const actual = getters.of(setting1)
      expect(actual).not.toStrictEqual(issues1)
      expect(actual).toStrictEqual(newIssues1)
    })

    it('removes issue', () => {
      let actual1 = getters.of(setting1)
      expect(actual1).toStrictEqual(issues1)

      mutations.remove(setting1)
      actual1 = getters.of(setting1)
      expect(actual1).not.toBeDefined()
    })
  })
})
