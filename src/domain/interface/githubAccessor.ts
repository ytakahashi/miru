import { Repository, Viewer } from '@/model/dto/githubApi'

export interface GitHubAccessor {
  getViewer (personalApiToken: string): Promise<Viewer>;
  getIssues (personalApiToken: string, owner: string, name: string): Promise<Repository>;
}
