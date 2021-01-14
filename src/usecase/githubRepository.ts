import { GitHubUrl, Issues, PullRequests } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'
import { Option } from '@/domain/interface/githubAccessor'
export { Option, SortDirection, SortField } from '@/domain/interface/githubAccessor'

export interface GitHubRepositoryUseCase {
  getIssues (url: RepositoryUrl, opts?: Option): Promise<Issues>
  getPullRequests (url: RepositoryUrl, opts?: Option): Promise<PullRequests>
}

export interface GitHubRepositoryUseCaseFactory {
  newGitHubRepositoryUseCase (githubUrl: GitHubUrl, personalAccessToken: string): GitHubRepositoryUseCase
}
