import { vi } from 'vite-plus/test'
import { Commit, CommitHistory } from '@/application/domain/model/github.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'
import { getters, mutations } from '@/store/commits.js'

const MockedCommitHistory = vi.fn()
MockedCommitHistory.mockImplementation(function MockedCommitHistoryImpl(
  s: RepositorySetting
): CommitHistory {
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

const commit1 = new MockedCommitHistory(setting1)
const commit2 = new MockedCommitHistory(setting2)
const commit3 = new MockedCommitHistory(setting3)
const commit = (url: string): Commit => new Commit('message', url, 0, 0, 0, '', '', '', '')

beforeEach(() => {
  mutations.add([commit1, commit2, commit3])
})

afterEach(() => {
  mutations.clear()
})

describe('commit history store', () => {
  describe('getters', () => {
    it('returns commit history', () => {
      const actual = getters.of(setting1)
      expect(actual).toStrictEqual(commit1)
    })
  })

  describe('mutations', () => {
    it('appends results to an existing repository', () => {
      const current = new CommitHistory(setting1, [commit('commit-1')], 3)
      mutations.replace(current)
      const before = getters.of(setting1)

      mutations.append(new CommitHistory(setting1, [commit('commit-2')], 3))

      expect(getters.of(setting1)?.results.map(result => result.commitUrl)).toEqual([
        'commit-1',
        'commit-2',
      ])
      expect(getters.of(setting1)).not.toBe(before)
    })

    it('adds results when the repository has no entry', () => {
      const setting4 = new RepositorySetting('https://github.com/foo/test4')
      const next = new CommitHistory(setting4, [commit('commit-1')], 1)

      mutations.append(next)

      expect(getters.of(setting4)?.results.map(result => result.commitUrl)).toEqual(['commit-1'])
      expect(getters.of(setting4)?.totalCount).toBe(1)
    })

    it('does not change other repositories when appending', () => {
      const other = getters.of(setting2)
      const third = getters.of(setting3)
      mutations.replace(new CommitHistory(setting1, [commit('commit-1')], 2))

      mutations.append(new CommitHistory(setting1, [commit('commit-2')], 2))

      expect(getters.of(setting2)).toBe(other)
      expect(getters.of(setting3)).toBe(third)
    })

    it('propagates concat errors without changing the existing entry', () => {
      mutations.replace(
        new CommitHistory(setting1, [commit('commit-1')], 2, undefined, { count: 10 })
      )
      const before = getters.of(setting1)

      expect(() =>
        mutations.append(
          new CommitHistory(setting1, [commit('commit-2')], 2, undefined, { count: 20 })
        )
      ).toThrow()

      expect(getters.of(setting1)).toBe(before)
      expect(getters.of(setting1)?.results.map(result => result.commitUrl)).toEqual(['commit-1'])
    })

    it('replaces commit history', () => {
      const newCommitHistory1 = new MockedCommitHistory(setting1)
      mutations.replace(newCommitHistory1)

      const actual = getters.of(setting1)
      expect(actual).not.toStrictEqual(commit1)
      expect(actual).toStrictEqual(newCommitHistory1)
    })

    it('removes commit history', () => {
      let actual1 = getters.of(setting1)
      expect(actual1).toStrictEqual(commit1)

      mutations.remove(setting1)
      actual1 = getters.of(setting1)
      expect(actual1).not.toBeDefined()
    })
  })
})
