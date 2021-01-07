import { newGitHubAccessor } from '@/domain/interface/factory'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { Repository } from '@/infrastructure/dto/githubApi'
import { GitHubUrl } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'

export class GitHubRepositoryService {
  #githubAccessor: GitHubAccessor
  #personalAccessToken: string

  constructor (githubUrl: GitHubUrl, personalAccessToken: string) {
    this.#githubAccessor = newGitHubAccessor(githubUrl)
    this.#personalAccessToken = personalAccessToken
  }

  getIssues = async (url: RepositoryUrl): Promise<Repository|undefined> => {
    if (this.#githubAccessor === undefined || !url.isValid()) {
      return undefined
    }

    return this.#githubAccessor.getIssues(this.#personalAccessToken, url.getOwner(), url.getRepositoryName())
  }
}
