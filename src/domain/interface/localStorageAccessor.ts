import { ApplicationSetting } from '@/model/application'
import { GitHubUser } from '@/model/dto/githubApi'
import { GitHubAccount } from '@/model/dto/local'

export interface LocalStorageAccessor {
  getPath (): string;
  setApplicationSettings (settings: Array<ApplicationSetting>): void;
  getApplicationSettings (): Array<ApplicationSetting>;
  setPersonalAccessToken (pat: string): void;
  getPersonalAccessToken (): string | undefined;
  setUser (user: GitHubUser): void;
  getUser (): GitHubUser | undefined;
  setGitHubAccount (account: GitHubAccount): void;
  getGitHubAccount (): GitHubAccount | undefined;
  setGitHubRepositoryUrls (urls: Array<string>): void;
  getGitHubRepositoryUrls (): Array<string>;
  deleteGitHubRepositoryUrls (): void;
}
