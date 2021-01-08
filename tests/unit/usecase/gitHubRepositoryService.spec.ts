/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { expect } from 'chai'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { Repository, Viewer } from '@/infrastructure/dto/githubApi'
import { GitHubRepositoryService } from '@/usecase/githubRepositoryService'
import { RepositoryUrl } from '@/domain/model/githubRepository'

describe('GitHubRepositoryService class', () => {
  const repository: Repository = require('../resources/issues.json')

  const mock: GitHubAccessor = {
    async getViewer (personalAccessToken: string): Promise<Viewer> {
      return require('../resources/viewer.json')
    },
    async getIssues (personalAccessToken: string, owner: string, name: string): Promise<Repository> {
      return repository
    }
  }

  describe('getIssues method', () => {
    it('returns issues', async () => {
      const sut = new GitHubRepositoryService(mock, 'pat')
      const actual = await sut.getIssues(new RepositoryUrl('https://github.com/ytakahashi/miru'))
      expect(actual).to.have.lengthOf(1)
    })
  })
})
