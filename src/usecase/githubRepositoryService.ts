import { newGitHubAccessor } from '@/domain/interface/factory'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { GitHubUrl, Issue, IssueLabel } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { GithubRepository, Repository } from '@/infrastructure/dto/githubApi'

export class GitHubRepositoryService {
  #githubAccessor: GitHubAccessor
  #personalAccessToken: string

  static init (githubUrl: GitHubUrl, personalAccessToken: string): GitHubRepositoryService {
    return new GitHubRepositoryService(newGitHubAccessor(githubUrl), personalAccessToken)
  }

  constructor (githubAccessor: GitHubAccessor, personalAccessToken: string) {
    this.#githubAccessor = githubAccessor
    this.#personalAccessToken = personalAccessToken
  }

  getIssues = async (url: RepositoryUrl): Promise<Array<Issue>> => {
    if (!url.isValid()) {
      throw new Error('Invalid GitHub URL.')
    }

    const throwsIfNonExistingRepo = (r: Repository): GithubRepository => {
      if (r.repository) {
        return r.repository
      } else {
        throw Error(`Repository Not Found: ${url.getUrl()}.`)
      }
    }

    const mapToIssueList = (r: GithubRepository): Array<Issue> => {
      return r.issues.edges
        .map(v => v.node)
        .map(v => new Issue(
          v.title,
          v.url,
          v.createdAt,
          v.updatedAt,
          v.labels.edges.map(l => new IssueLabel(l.node.name, l.node.color))
        ))
    }

    return this.#githubAccessor.getIssues(this.#personalAccessToken, url.getOwner(), url.getRepositoryName())
      .then(throwsIfNonExistingRepo)
      .then(mapToIssueList)
      .catch(e => { throw e })
  }
}
