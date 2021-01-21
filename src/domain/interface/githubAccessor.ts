import { IssueConnection, PullRequestConnection, Viewer } from '@/infrastructure/dto/githubApi'
import { RepositorySetting } from '@/domain/model/githubRepository'

export type SortField = 'COMMENTS' | 'CREATED_AT' | 'UPDATED_AT'
export type SortDirection = 'ASC' | 'DESC'

export type Option = {
  count?: number;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export interface GitHubAccessor {
  getViewer (personalAccessToken: string): Promise<Viewer>;
  getIssues (personalAccessToken: string, url: RepositorySetting, opts?: Option): Promise<IssueConnection>;
  getPullRequests (personalAccessToken: string, url: RepositorySetting, opts?: Option): Promise<PullRequestConnection>;
}
