import { PullRequests } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { getters, mutations } from '@/store/pullRequests'

const MockedPullRequests = jest.fn<PullRequests, [RepositoryUrl]>()
MockedPullRequests.mockImplementation((url: RepositoryUrl): PullRequests => {
  return {
    fetchedAt: 1,
    repositoryUrl: url.getUrl(),
    results: [],
    totalCount: 1,
    fetchedAtDate: () => '',
    belongsTo: (r: string): boolean => {
      return url.getUrl() === r
    },
    hasContents: (): boolean => true
  }
})

const url1 = new RepositoryUrl('https://github.com/foo/test1')
const url2 = new RepositoryUrl('https://github.com/foo/test2')
const url3 = new RepositoryUrl('https://github.com/foo/test3')

const pr1 = new MockedPullRequests(url1)
const pr2 = new MockedPullRequests(url2)
const pr3 = new MockedPullRequests(url3)

beforeAll(() => {
  mutations.add([pr1, pr2, pr3])
})

afterAll(() => {
  mutations.clear()
})

describe('PullRequests store', () => {
  describe('getters', () => {
    it('returns pull requests', () => {
      const actual = getters.of(url1)
      expect(actual).toStrictEqual(pr1)
    })
  })

  describe('mutations', () => {
    it('replaces pull requests', () => {
      const newPR1 = new MockedPullRequests(url1)
      mutations.replace(newPR1)

      const actual = getters.of(url1)
      expect(actual).not.toStrictEqual(pr1)
      expect(actual).toStrictEqual(newPR1)
    })
  })
})
