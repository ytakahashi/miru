import { ApplicationSetting } from '@/domain/model/application'
import { GitHubUser } from '@/infrastructure/dto/githubApi'
import { GitHubAccount } from '@/infrastructure/dto/local'

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
