import { GitHubUrl, Issues, PullRequests } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'

export interface GitHubRepositoryUseCase {
  getIssues (url: RepositoryUrl): Promise<Issues>
  getPullRequests (url: RepositoryUrl): Promise<PullRequests>
}

export interface GitHubRepositoryUseCaseFactory {
  newGitHubRepositoryUseCase (githubUrl: GitHubUrl, personalAccessToken: string): GitHubRepositoryUseCase
}
