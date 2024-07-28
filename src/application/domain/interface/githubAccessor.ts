import { RepositorySetting } from '@/application/domain/model/githubRepository.js'
import {
  CommitHistoryConnection,
  IssueConnection,
  PullRequestConnection,
  ReleaseConnection,
  Viewer,
} from '@/application/infrastructure/dto/githubApi.js'

export type SortField = 'COMMENTS' | 'CREATED_AT' | 'UPDATED_AT' | 'NAME'
export type SortDirection = 'ASC' | 'DESC'
export type IssueState = 'OPEN' | 'CLOSED'
export type PullRequestState = 'OPEN' | 'CLOSED' | 'MERGED'
export type QueryState = IssueState | PullRequestState

export type Option = {
  count?: number
  sortField?: SortField
  sortDirection?: SortDirection
  states?: QueryState[]
}

export interface GitHubAccessor {
  getViewer(personalAccessToken: string): Promise<Viewer>
  getIssues(
    personalAccessToken: string,
    url: RepositorySetting,
    opts?: Option
  ): Promise<IssueConnection>
  getPullRequests(
    personalAccessToken: string,
    url: RepositorySetting,
    opts?: Option
  ): Promise<PullRequestConnection>
  getReleases(
    personalAccessToken: string,
    url: RepositorySetting,
    opts?: Option
  ): Promise<ReleaseConnection>
  getCommits(
    personalAccessToken: string,
    url: RepositorySetting,
    opts?: Option
  ): Promise<CommitHistoryConnection>
}

export class GitHubAccessError extends Error {
  static {
    this.prototype.name = 'GitHubAccessError'
  }
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}
