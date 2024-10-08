import { GitHubAccessor, Option } from '@/application/domain/interface/githubAccessor.js'
import {
  Commit,
  CommitHistory,
  Issue,
  Issues,
  Label,
  PullRequest,
  PullRequestReviews,
  PullRequests,
  Release,
  Releases,
  TagReference,
} from '@/application/domain/model/github.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'
import {
  CommitHistoryConnection,
  IssueConnection,
  PullRequestConnection,
  PullRequestReview,
  PullRequestReviewConnection,
  ReleaseConnection,
} from '@/application/infrastructure/dto/githubApi.js'
import {
  GetCommitHistoryUseCase,
  GetIssuesUseCase,
  GetPullRequestsUseCase,
  GetReleasesUseCase,
} from '@/application/usecase/githubRepository.js'

export class GetIssuesUseCaseInteractor implements GetIssuesUseCase {
  #githubAccessor: GitHubAccessor
  #personalAccessToken: string

  constructor(githubAccessor: GitHubAccessor, personalAccessToken: string) {
    this.#githubAccessor = githubAccessor
    this.#personalAccessToken = personalAccessToken
  }

  execute = (setting: RepositorySetting, opts?: Option): Promise<Issues> => {
    if (!setting.isValid()) {
      throw new Error('Invalid GitHub URL.')
    }

    if (!this.#personalAccessToken) {
      throw new Error('Personal Access Token is not set.')
    }

    const mapToIssues = (i: IssueConnection): Issues => {
      const issues = i.edges
        .map(v => v.node)
        .map(
          v =>
            new Issue(
              v.author.login,
              v.title,
              v.url,
              v.createdAt,
              v.updatedAt,
              v.number,
              v.labels.edges.map(l => new Label(l.node.name, l.node.color)),
              v.comments.totalCount,
              v.participants.totalCount,
              v.assignees.nodes.some(a => a.isViewer),
              v.viewerDidAuthor,
              v.state,
              v.stateReason
            )
        )
      return new Issues(setting, issues, i.totalCount)
    }

    return this.#githubAccessor
      .getIssues(this.#personalAccessToken, setting, opts)
      .then(mapToIssues)
      .catch(e => {
        throw e
      })
  }
}

export class GetPullRequestsUseCaseInteractor implements GetPullRequestsUseCase {
  #githubAccessor: GitHubAccessor
  #personalAccessToken: string

  constructor(githubAccessor: GitHubAccessor, personalAccessToken: string) {
    this.#githubAccessor = githubAccessor
    this.#personalAccessToken = personalAccessToken
  }

  execute = (setting: RepositorySetting, opts?: Option): Promise<PullRequests> => {
    if (!setting.isValid()) {
      throw new Error('Invalid GitHub URL.')
    }

    if (!this.#personalAccessToken) {
      throw new Error('Personal Access Token is not set.')
    }

    const reviewCommentMapper = (reviewNodes: PullRequestReview): number =>
      reviewNodes.body !== ''
        ? reviewNodes.comments.totalCount + 1
        : reviewNodes.comments.totalCount

    const countReviewComments = (review: PullRequestReviewConnection): PullRequestReviews => {
      const remained = review.totalCount !== review.nodes.length
      const result = review.nodes.map(reviewCommentMapper).reduce((a, b) => a + b, 0)
      return new PullRequestReviews(result, remained)
    }
    const mapToPullRequests = (v: PullRequestConnection): PullRequests => {
      const prs = v.edges
        .map(v => v.node)
        .map(
          v =>
            new PullRequest(
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
              v.isDraft,
              countReviewComments(v.reviews),
              v.assignees.nodes.some(a => a.isViewer),
              v.reviewRequests.nodes.some(r => r.requestedReviewer?.isViewer),
              v.viewerDidAuthor,
              v.state
            )
        )
      return new PullRequests(setting, prs, v.totalCount)
    }

    return this.#githubAccessor
      .getPullRequests(this.#personalAccessToken, setting, opts)
      .then(mapToPullRequests)
      .catch(e => {
        throw e
      })
  }
}

export class GetReleasesUseCaseInteractor implements GetReleasesUseCase {
  #githubAccessor: GitHubAccessor
  #personalAccessToken: string

  constructor(githubAccessor: GitHubAccessor, personalAccessToken: string) {
    this.#githubAccessor = githubAccessor
    this.#personalAccessToken = personalAccessToken
  }

  execute = (setting: RepositorySetting, opts?: Option): Promise<Releases> => {
    if (!setting.isValid()) {
      throw new Error('Invalid GitHub URL.')
    }

    if (!this.#personalAccessToken) {
      throw new Error('Personal Access Token is not set.')
    }

    const mapToReleases = (v: ReleaseConnection): Releases => {
      const releases = v.edges
        .map(v => v.node)
        .map(
          v =>
            new Release(
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
            )
        )
      return new Releases(setting, releases, v.totalCount)
    }

    return this.#githubAccessor
      .getReleases(this.#personalAccessToken, setting, opts)
      .then(mapToReleases)
  }
}

export class GetCommitHistoryUseCaseInteractor implements GetCommitHistoryUseCase {
  #githubAccessor: GitHubAccessor
  #personalAccessToken: string

  constructor(githubAccessor: GitHubAccessor, personalAccessToken: string) {
    this.#githubAccessor = githubAccessor
    this.#personalAccessToken = personalAccessToken
  }

  execute = (setting: RepositorySetting, opts?: Option): Promise<CommitHistory> => {
    if (!setting.isValid()) {
      throw new Error('Invalid GitHub URL.')
    }

    if (!this.#personalAccessToken) {
      throw new Error('Personal Access Token is not set.')
    }

    const mapToCommitHistory = (v: CommitHistoryConnection): CommitHistory => {
      const history = v.nodes.map(
        c =>
          new Commit(
            c.message,
            c.commitUrl,
            c.additions,
            c.deletions,
            c.changedFilesIfAvailable,
            c.author?.user?.login,
            c.authoredDate,
            c.committer?.user?.login,
            c.committedDate
          )
      )
      return new CommitHistory(setting, history, v.nodes.length)
    }

    return this.#githubAccessor
      .getCommits(this.#personalAccessToken, setting, opts)
      .then(mapToCommitHistory)
  }
}
