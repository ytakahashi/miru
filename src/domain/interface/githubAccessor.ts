import { Repository, Viewer } from '@/model/dto/githubApi'

export interface GitHubAccessor {
  getViewer (): Promise<Viewer>;
  getIssues (owner: string, name: string): Promise<Repository>;
}
