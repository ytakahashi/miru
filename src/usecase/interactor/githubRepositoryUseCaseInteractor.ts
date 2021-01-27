import { GitHubAccessor, Option } from '@/domain/interface/githubAccessor'
import { Issues, Issue, Label, PullRequest, PullRequests, TagReference, Release, Releases } from '@/domain/model/github'
import { RepositorySetting } from '@/domain/model/githubRepository'
import { IssueConnection, PullRequestConnection, ReleaseConnection } from '@/infrastructure/dto/githubApi'
import { GitHubRepositoryUseCase } from '@/usecase/githubRepository'

export class GitHubRepositoryUseCaseInteractor implements GitHubRepositoryUseCase {
  #githubAccessor: GitHubAccessor
  #personalAccessToken: string

  constructor (githubAccessor: GitHubAccessor, personalAccessToken: string) {
    this.#githubAccessor = githubAccessor
    this.#personalAccessToken = personalAccessToken
  }

  getIssues = async (setting: RepositorySetting, opts?: Option): Promise<Issues> => {
    if (!setting.isValid()) {
      throw new Error('Invalid GitHub URL.')
    }

    const mapToIssues = (i: IssueConnection): Issues => {
      const issues = i.edges
        .map(v => v.node)
        .map(v => new Issue(
          v.author.login,
          v.title,
          v.url,
          v.createdAt,
          v.updatedAt,
          v.number,
          v.labels.edges.map(l => new Label(l.node.name, l.node.color)),
          v.comments.totalCount,
          v.participants.totalCount
        ))
      return new Issues(setting, issues, i.totalCount)
    }

    return this.#githubAccessor.getIssues(this.#personalAccessToken, setting, opts)
      .then(mapToIssues)
      .catch(e => { throw e })
  }

  getPullRequests = async (setting: RepositorySetting, opts?: Option): Promise<PullRequests> => {
    if (!setting.isValid()) {
      throw new Error('Invalid GitHub URL.')
    }

    const mapToPullRequests = (v: PullRequestConnection): PullRequests => {
      const prs = v.edges
        .map(v => v.node)
        .map(v => new PullRequest(
          v.author.login,
          v.title,
          v.url,
          v.createdAt,
          v.updatedAt,
          v.number,
          v.labels.edges.map(l => new Label(l.node.name, l.node.color)),
          v.comments.totalCount,
          v.participants.totalCount,
          v.additions,
          v.deletions,
          v.changedFiles,
          v.isDraft
        ))
      return new PullRequests(setting, prs, v.totalCount)
    }

    return this.#githubAccessor.getPullRequests(this.#personalAccessToken, setting, opts)
      .then(mapToPullRequests)
      .catch(e => { throw e })
  }

  getReleases = async (setting: RepositorySetting, opts?: Option): Promise<Releases> => {
    if (!setting.isValid()) {
      throw new Error('Invalid GitHub URL.')
    }

    const mapToReleases = (v: ReleaseConnection): Releases => {
      const releases = v.edges
        .map(v => v.node)
        .map(v => new Release(
          v.author.login,
          v.name,
          v.url,
          v.publishedAt,
          v.updatedAt,
          v.isDraft,
          v.isPrerelease,
          v.releaseAssets.totalCount,
          v.tag?.name,
          v.tag?.target === undefined
            ? undefined
            : new TagReference(v.tag.target.abbreviatedOid, v.tag.target.commitUrl)
        ))
      return new Releases(setting, releases, v.totalCount)
    }

    return this.#githubAccessor.getReleases(this.#personalAccessToken, setting, opts)
      .then(mapToReleases)
  }
}
