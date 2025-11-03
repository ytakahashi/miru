import { vi } from 'vitest'
import { PullRequests } from '@/application/domain/model/github.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'
import { getters, mutations } from '@/store/pullRequests.js'

const MockedPullRequests = vi.fn()
MockedPullRequests.mockImplementation(function MockedPullRequestsImpl(
  url: RepositorySetting
): PullRequests {
  return {
    fetchedAt: 1,
    repositoryUrl: url.getUrl(),
    results: [],
    totalCount: 1,
    fetchedAtDate: () => '',
    belongsTo: (r: string): boolean => {
      return url.getUrl() === r
    },
    hasContents: (): boolean => true,
  }
})

const setting1 = new RepositorySetting('https://github.com/foo/test1')
const setting2 = new RepositorySetting('https://github.com/foo/test2')
const setting3 = new RepositorySetting('https://github.com/foo/test3')

const pr1 = new MockedPullRequests(setting1)
const pr2 = new MockedPullRequests(setting2)
const pr3 = new MockedPullRequests(setting3)

beforeEach(() => {
  mutations.add([pr1, pr2, pr3])
})

afterEach(() => {
  mutations.clear()
})

describe('PullRequests store', () => {
  describe('getters', () => {
    it('returns pull requests', () => {
      const actual = getters.of(setting1)
      expect(actual).toStrictEqual(pr1)
    })
  })

  describe('mutations', () => {
    it('replaces pull requests', () => {
      const newPR1 = new MockedPullRequests(setting1)
      mutations.replace(newPR1)

      const actual = getters.of(setting1)
      expect(actual).not.toStrictEqual(pr1)
      expect(actual).toStrictEqual(newPR1)
    })

    it('removes PR', () => {
      let actual1 = getters.of(setting1)
      expect(actual1).toStrictEqual(pr1)

      mutations.remove(setting1)
      actual1 = getters.of(setting1)
      expect(actual1).not.toBeDefined()
    })
  })
})
