import { CommitHistory, GitHubUrl, Issues, PullRequests, Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { Option } from '@/application/domain/interface/githubAccessor'
export { Option, SortDirection, SortField } from '@/application/domain/interface/githubAccessor'

export interface GetIssuesUseCase {
  execute (setting: RepositorySetting, opts?: Option): Promise<Issues>
}

export interface GetPullRequestsUseCase {
  execute (setting: RepositorySetting, opts?: Option): Promise<PullRequests>
}

export interface GetReleasesUseCase {
  execute (setting: RepositorySetting, opts?: Option): Promise<Releases>
}

export interface GetCommitHistoryUseCase {
  execute (setting: RepositorySetting, opts?: Option): Promise<CommitHistory>
}

export interface GetIssuesUseCaseFactory {
  create (githubUrl: GitHubUrl, personalAccessToken: string): GetIssuesUseCase
}

export interface GetPullRequestsUseCaseFactory {
  create (githubUrl: GitHubUrl, personalAccessToken: string): GetPullRequestsUseCase
}

export interface GetReleasesUseCaseFactory {
  create (githubUrl: GitHubUrl, personalAccessToken: string): GetReleasesUseCase
}

export interface GetCommitHistoryUseCaseFactory {
  create (githubUrl: GitHubUrl, personalAccessToken: string): GetCommitHistoryUseCase
}
