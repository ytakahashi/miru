import { vi } from 'vite-plus/test'
import { Issue, Issues } from '@/application/domain/model/github.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'
import { getters, mutations } from '@/store/issues.js'

const MockedIssues = vi.fn()
MockedIssues.mockImplementation(function MockedIssuesImpl(s: RepositorySetting): Issues {
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
const issue = (url: string): Issue =>
  new Issue('author', 'title', url, '', '', 1, [], 0, 0, false, false, 'OPEN')

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
    it('appends results to an existing repository', () => {
      const current = new Issues(setting1, [issue('issue-1')], 3)
      mutations.replace(current)
      const before = getters.of(setting1)

      mutations.append(new Issues(setting1, [issue('issue-2')], 3))

      expect(getters.of(setting1)?.results.map(result => result.url)).toEqual([
        'issue-1',
        'issue-2',
      ])
      expect(getters.of(setting1)).not.toBe(before)
    })

    it('adds results when the repository has no entry', () => {
      const setting4 = new RepositorySetting('https://github.com/foo/test4')
      const next = new Issues(setting4, [issue('issue-1')], 1)

      mutations.append(next)

      expect(getters.of(setting4)?.results.map(result => result.url)).toEqual(['issue-1'])
      expect(getters.of(setting4)?.totalCount).toBe(1)
    })

    it('does not change other repositories when appending', () => {
      const other = getters.of(setting2)
      const third = getters.of(setting3)
      mutations.replace(new Issues(setting1, [issue('issue-1')], 2))

      mutations.append(new Issues(setting1, [issue('issue-2')], 2))

      expect(getters.of(setting2)).toBe(other)
      expect(getters.of(setting3)).toBe(third)
    })

    it('propagates concat errors without changing the existing entry', () => {
      mutations.replace(new Issues(setting1, [issue('issue-1')], 2, undefined, { count: 10 }))
      const before = getters.of(setting1)

      expect(() =>
        mutations.append(new Issues(setting1, [issue('issue-2')], 2, undefined, { count: 20 }))
      ).toThrow()

      expect(getters.of(setting1)).toBe(before)
      expect(getters.of(setting1)?.results.map(result => result.url)).toEqual(['issue-1'])
    })

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
