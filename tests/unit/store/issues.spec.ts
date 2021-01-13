import { Issues } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { getters, mutations } from '@/store/issues'

const MockedIssues = jest.fn<Issues, [RepositoryUrl]>()
MockedIssues.mockImplementation((url: RepositoryUrl): Issues => {
  return {
    fetchedAt: 1,
    repositoryUrl: url,
    results: [],
    totalCount: 1,
    fetchedAtDate: () => '',
    belongsTo: (r: RepositoryUrl): boolean => {
      return url.equals(r)
    },
    hasContents: (): boolean => true
  }
})

const url1 = new RepositoryUrl('https://github.com/foo/test1')
const url2 = new RepositoryUrl('https://github.com/foo/test2')
const url3 = new RepositoryUrl('https://github.com/foo/test3')

const issues1 = new MockedIssues(url1)
const issues2 = new MockedIssues(url2)
const issues3 = new MockedIssues(url3)

beforeAll(() => {
  mutations.add([issues1, issues2, issues3])
})

afterAll(() => {
  mutations.clear()
})

describe('issue store', () => {
  describe('getters', () => {
    it('returns issue', () => {
      const actual = getters.of(url1)
      expect(actual).toStrictEqual(issues1)
    })
  })

  describe('mutations', () => {
    it('replaces issue', () => {
      const newIssues1 = new MockedIssues(url1)
      mutations.replace(newIssues1)

      const actual = getters.of(url1)
      expect(actual).not.toStrictEqual(issues1)
      expect(actual).toStrictEqual(newIssues1)
    })
  })
})
