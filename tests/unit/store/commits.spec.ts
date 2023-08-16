import { CommitHistory } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { getters, mutations } from '@/store/commits'

const MockedCommitHistory = jest.fn<CommitHistory, [RepositorySetting]>()
MockedCommitHistory.mockImplementation((s: RepositorySetting): CommitHistory => {
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
