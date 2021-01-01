import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { newGitHubAccessor, newLocalStorageAccessor } from '@/domain/interface/factory'
import { Repository, RepositoryUrl } from '@/model/githubRepository'

type repository = {
  owner: string;
  name: string;
}

export class GitHubRepositoryService {
  private githubAccessor?: GitHubAccessor
  private localStorageAccessor: LocalStorageAccessor

  constructor (apiEndpoint: string, githubPersonalAccessToken: string) {
    this.githubAccessor = newGitHubAccessor(apiEndpoint, githubPersonalAccessToken)
    this.localStorageAccessor = newLocalStorageAccessor()
  }

  async getIssues (url: RepositoryUrl): Promise<Repository|undefined> {
    if (this.githubAccessor === undefined || !url.isValid()) {
      return undefined
    }

    const issues = await this.githubAccessor.getIssues(url.getOwner(), url.getName())
    return issues
  }
}
