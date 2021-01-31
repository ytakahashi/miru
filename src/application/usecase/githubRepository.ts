import { GitHubUrl, Issues, PullRequests, Releases } from '@/application/domain/model/github'
import { RepositorySetting } from '@/application/domain/model/githubRepository'
import { Option } from '@/application/domain/interface/githubAccessor'
export { Option, SortDirection, SortField } from '@/application/domain/interface/githubAccessor'

export interface GitHubRepositoryUseCase {
  getIssues (setting: RepositorySetting, opts?: Option): Promise<Issues>
  getPullRequests (setting: RepositorySetting, opts?: Option): Promise<PullRequests>
  getReleases (setting: RepositorySetting, opts?: Option): Promise<Releases>
}

export interface GitHubRepositoryUseCaseFactory {
  newGitHubRepositoryUseCase (githubUrl: GitHubUrl, personalAccessToken: string): GitHubRepositoryUseCase
}
