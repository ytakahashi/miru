import { GitHubAccessor } from '@/application/domain/interface/githubAccessor.js'
import { GitHubUrl } from '@/application/domain/model/github.js'
import { GitHubAccountUseCaseInteractor } from '@/application/usecase/interactor/githubAccountUseCaseInteractor.js'
import { Viewer } from '@/application/infrastructure/dto/githubApi.js'

describe('GitHubAccountUseCaseInteractor.ts', () => {
  const githubUrl = new GitHubUrl('https://github.com', 'https://api.github.com/graphql')

  describe('resolvePersonalAccessToken', () => {
    it('returns an Account resolved from the viewer', async () => {
      const viewer: Viewer = {
        viewer: {
          login: 'ytakahashi',
          url: 'https://github.com/ytakahashi',
          avatarUrl: 'https://avatarUrl',
        },
      }
      const mock: GitHubAccessor = {
        getViewer: async (_personalAccessToken: string) => viewer,
        getIssues: async () => {
          throw new Error('not implemented')
        },
        getPullRequests: async () => {
          throw new Error('not implemented')
        },
        getReleases: async () => {
          throw new Error('not implemented')
        },
        getCommits: async () => {
          throw new Error('not implemented')
        },
      }
      const sut = new GitHubAccountUseCaseInteractor(githubUrl, mock)

      const actual = await sut.resolvePersonalAccessToken('pat')

      expect(actual.userName).toBe('ytakahashi')
      expect(actual.profileUrl).toBe('https://github.com/ytakahashi')
      expect(actual.avatarUrl).toBe('https://avatarUrl')
      expect(actual.personalAccessToken).toBe('pat')
      expect(actual.githubUrl.getUrl()).toBe(githubUrl.getUrl())
    })

    it('throws when the viewer cannot be resolved', async () => {
      // getViewer is typed as Promise<Viewer>, but a malformed GraphQL response can still
      // resolve to undefined at runtime; the interactor guards against that case explicitly.
      const mock: GitHubAccessor = {
        getViewer: async (_personalAccessToken: string) => undefined as unknown as Viewer,
        getIssues: async () => {
          throw new Error('not implemented')
        },
        getPullRequests: async () => {
          throw new Error('not implemented')
        },
        getReleases: async () => {
          throw new Error('not implemented')
        },
        getCommits: async () => {
          throw new Error('not implemented')
        },
      }
      const sut = new GitHubAccountUseCaseInteractor(githubUrl, mock)

      await expect(sut.resolvePersonalAccessToken('pat')).rejects.toThrow('unknown account')
    })
  })
})
