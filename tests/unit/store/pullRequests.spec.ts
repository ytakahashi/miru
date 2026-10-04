import { PullRequest, PullRequestReviews, PullRequests } from '@/application/domain/model/github.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'
import { getters, mutations } from '@/store/pullRequests.js'

const setting1 = new RepositorySetting('https://github.com/foo/test1')
const setting2 = new RepositorySetting('https://github.com/foo/test2')
const setting3 = new RepositorySetting('https://github.com/foo/test3')

const pr1 = new PullRequests(setting1, [], 1)
const pr2 = new PullRequests(setting2, [], 1)
const pr3 = new PullRequests(setting3, [], 1)
const pullRequest = (url: string): PullRequest =>
  new PullRequest(
    'author',
    'title',
    url,
    '',
    '',
    1,
    [],
    0,
    0,
    0,
    0,
    0,
    false,
    new PullRequestReviews(0, false),
    false,
    false,
    false,
    'OPEN'
  )

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
    it('appends results to an existing repository', () => {
      const current = new PullRequests(setting1, [pullRequest('pr-1')], 3)
      mutations.replace(current)
      const before = getters.of(setting1)

      mutations.append(new PullRequests(setting1, [pullRequest('pr-2')], 3))

      expect(getters.of(setting1)?.results.map(result => result.url)).toEqual(['pr-1', 'pr-2'])
      expect(getters.of(setting1)).not.toBe(before)
    })

    it('adds results when the repository has no entry', () => {
      const setting4 = new RepositorySetting('https://github.com/foo/test4')
      const next = new PullRequests(setting4, [pullRequest('pr-1')], 1)

      mutations.append(next)

      expect(getters.of(setting4)?.results.map(result => result.url)).toEqual(['pr-1'])
      expect(getters.of(setting4)?.totalCount).toBe(1)
    })

    it('does not change other repositories when appending', () => {
      const other = getters.of(setting2)
      const third = getters.of(setting3)
      mutations.replace(new PullRequests(setting1, [pullRequest('pr-1')], 2))

      mutations.append(new PullRequests(setting1, [pullRequest('pr-2')], 2))

      expect(getters.of(setting2)).toBe(other)
      expect(getters.of(setting3)).toBe(third)
    })

    it('propagates concat errors without changing the existing entry', () => {
      mutations.replace(
        new PullRequests(setting1, [pullRequest('pr-1')], 2, undefined, { count: 10 })
      )
      const before = getters.of(setting1)

      expect(() =>
        mutations.append(
          new PullRequests(setting1, [pullRequest('pr-2')], 2, undefined, { count: 20 })
        )
      ).toThrow('Cannot concatenate results fetched with different query conditions.')

      expect(getters.of(setting1)).toBe(before)
      expect(getters.of(setting1)?.results.map(result => result.url)).toEqual(['pr-1'])
    })

    it('replaces pull requests', () => {
      const before = getters.of(setting1)
      const newPR1 = new PullRequests(setting1, [], 1)
      mutations.replace(newPR1)

      const actual = getters.of(setting1)
      expect(actual).not.toBe(before)
      expect(actual).toBe(newPR1)
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
