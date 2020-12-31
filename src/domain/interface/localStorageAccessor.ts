import { GitHubUser } from '@/model/githubUser'

export interface LocalStorageAccessor {
  setPersonalAccessToken (pat: string): void;
  getPersonalAccessToken (): string | undefined;
  setUser (user: GitHubUser): void;
  getUser (): GitHubUser | undefined;
  setGitHubRepositoryUrls (urls: Array<string>): void;
  getGitHubRepositoryUrls (): Array<string>;
  deleteGitHubRepositoryUrls (): void;
}
