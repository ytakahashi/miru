import { IssueConnection, PullRequestConnection, Viewer } from '@/infrastructure/dto/githubApi'
import { RepositoryUrl } from '@/domain/model/githubRepository'

export interface GitHubAccessor {
  getViewer (personalAccessToken: string): Promise<Viewer>;
  getIssues (personalAccessToken: string, url: RepositoryUrl): Promise<IssueConnection>;
  getPullRequests (personalAccessToken: string, url: RepositoryUrl): Promise<PullRequestConnection>;
}
