import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { newGitHubAccessor, newLocalStorageAccessor } from '@/domain/interface/factory'
import { Repository } from '@/model/githubRepository'

const regex = /^https:\/\/(?<origin>[^/]+)\/(?<owner>[^/]+)\/(?<name>.+)$/

type repository = {
  owner: string;
  name: string;
}

const parseRepositoryUrl = (url: string): repository|null => {
  const result = url.match(regex)
  if (result?.groups !== undefined) {
    return {
      owner: result.groups.owner,
      name: result.groups.name
    }
  }
  return null
}

export class GitHubRepositoryService {
  private githubAccessor?: GitHubAccessor
  private localStorageAccessor: LocalStorageAccessor

  constructor (apiEndpoint: string, githubPersonalAccessToken: string) {
    this.githubAccessor = newGitHubAccessor(apiEndpoint, githubPersonalAccessToken)
    this.localStorageAccessor = newLocalStorageAccessor()
  }

  async getIssues (url: string): Promise<Repository|undefined> {
    if (this.githubAccessor === undefined) {
      return undefined
    }

    const repo = parseRepositoryUrl(url)
    if (repo === null) {
      return undefined
    }

    const issues = await this.githubAccessor.getIssues(repo.owner, repo.name)
    return issues
  }
}
