import { Viewer } from '@/model/githubUser'
import { Repository } from '@/model/githubRepository'

export interface GitHubAccessor {
  getViewer (): Promise<Viewer>;
  getIssues (owner: string, name: string): Promise<Repository>;
}
