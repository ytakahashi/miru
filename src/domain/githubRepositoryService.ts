import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { newGitHubAccessor } from '@/domain/interface/factory'
import { GitHubUrl } from '@/model/github'
import { RepositoryUrl } from '@/model/githubRepository'
import { Repository } from '@/model/dto/githubApi'

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

    const issues = await this.#githubAccessor.getIssues(this.#personalAccessToken, url.getOwner(), url.getName())
    return issues
  }
}
