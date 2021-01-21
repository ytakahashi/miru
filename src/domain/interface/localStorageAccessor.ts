import { ApplicationSetting } from '@/domain/model/application'
import { GitHubAccount } from '@/infrastructure/dto/local'

export type RepositorySetting = {
  url: string;
  showsIssues: boolean;
  showsPullRequests: boolean;
}

export interface LocalStorageAccessor {
  getPath (): string;
  setApplicationSettings (settings: Array<ApplicationSetting>): void;
  getApplicationSettings (): Array<ApplicationSetting>;
  setGitHubAccount (account: GitHubAccount): void;
  getGitHubAccount (): GitHubAccount | undefined;
  setRepositorySettings (settings: Array<RepositorySetting>): void;
  getRepositorySettings (): Array<RepositorySetting>;
}
