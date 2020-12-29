import { Viewer } from '@/model/github'
import { Repository } from '@/model/githubRepository'

export interface GitHubAccessor {
  getViewer (): Promise<Viewer>;
  getIssues (owner: string, name: string): Promise<Repository>;
}
