import { Viewer } from '@/model/github'

export interface GitHubAccessor {
  getViewer (): Promise<Viewer>;
}
