import { Repository, Viewer } from '@/infrastructure/dto/githubApi'

export interface GitHubAccessor {
  getViewer (personalAccessToken: string): Promise<Viewer>;
  getIssues (personalAccessToken: string, owner: string, name: string): Promise<Repository>;
}
