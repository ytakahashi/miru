import { GitHubUser } from '@/model/github'

export interface LocalStorageAccessor {
  setPersonalAccessToken (pat: string): void;
  getPersonalAccessToken (): string | undefined;
  setUser (user: GitHubUser): void;
  getUser (): GitHubUser | undefined;
}
