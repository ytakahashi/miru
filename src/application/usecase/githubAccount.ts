import { Account, GitHubUrl } from '@/application/domain/model/github.js'

export interface GitHubAccountUseCase {
  resolvePersonalAccessToken(personalAccessToken: string): Promise<Account>
}

export interface GitHubAccountUseCaseFactory {
  newGitHubAccountUseCase(githubUrl: GitHubUrl): GitHubAccountUseCase
}
