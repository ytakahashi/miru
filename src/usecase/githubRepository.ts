import { GitHubUrl, Issues, PullRequests } from '@/domain/model/github'
import { RepositorySetting } from '@/domain/model/githubRepository'
import { Option } from '@/domain/interface/githubAccessor'
export { Option, SortDirection, SortField } from '@/domain/interface/githubAccessor'

export interface GitHubRepositoryUseCase {
  getIssues (setting: RepositorySetting, opts?: Option): Promise<Issues>
  getPullRequests (setting: RepositorySetting, opts?: Option): Promise<PullRequests>
}

export interface GitHubRepositoryUseCaseFactory {
  newGitHubRepositoryUseCase (githubUrl: GitHubUrl, personalAccessToken: string): GitHubRepositoryUseCase
}
