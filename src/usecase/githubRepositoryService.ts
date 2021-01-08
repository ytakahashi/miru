import { newGitHubAccessor } from '@/domain/interface/factory'
import { GitHubAccessor } from '@/domain/interface/githubAccessor'
import { GitHubUrl, Issues, Issue, Label, PullRequest, PullRequests } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { IssueConnection, PullRequestConnection } from '@/infrastructure/dto/githubApi'

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

  getIssues = async (url: RepositoryUrl): Promise<Issues> => {
    if (!url.isValid()) {
      throw new Error('Invalid GitHub URL.')
    }

    const mapToIssues = (i: IssueConnection): Issues => {
      const issues = i.edges
        .map(v => v.node)
        .map(v => new Issue(
          v.author.login,
          v.number,
          v.title,
          v.url,
          v.createdAt,
          v.updatedAt,
          v.labels.edges.map(l => new Label(l.node.name, l.node.color)),
          v.comments.totalCount,
          v.participants.totalCount
        ))
      return new Issues(issues, i.totalCount)
    }

    return this.#githubAccessor.getIssues(this.#personalAccessToken, url)
      .then(mapToIssues)
      .catch(e => { throw e })
  }

  getPullRequests = async (url: RepositoryUrl): Promise<PullRequests> => {
    if (!url.isValid()) {
      throw new Error('Invalid GitHub URL.')
    }

    const mapToPullRequests = (v: PullRequestConnection): PullRequests => {
      const prs = v.edges
        .map(v => v.node)
        .map(v => new PullRequest(
          v.author.login,
          v.number,
          v.title,
          v.url,
          v.createdAt,
          v.updatedAt,
          v.labels.edges.map(l => new Label(l.node.name, l.node.color)),
          v.comments.totalCount,
          v.participants.totalCount,
          v.additions,
          v.deletions,
          v.changedFiles,
          v.isDraft
        ))
      return new PullRequests(prs, v.totalCount)
    }

    return this.#githubAccessor.getPullRequests(this.#personalAccessToken, url)
      .then(mapToPullRequests)
      .catch(e => { throw e })
  }
}
