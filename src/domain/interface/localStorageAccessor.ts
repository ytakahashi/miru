import { ApplicationSetting } from '@/domain/model/application'
import { GitHubAccount, RepositorySetting } from '@/infrastructure/dto/local'

export interface LocalStorageAccessor {
  getPath (): string;
  setApplicationSettings (settings: Array<ApplicationSetting>): void;
  getApplicationSettings (): Array<ApplicationSetting>;
  setGitHubAccount (account: GitHubAccount): void;
  getGitHubAccount (): GitHubAccount | undefined;
  setRepositorySettings (settings: Array<RepositorySetting>): void;
  getRepositorySettings (): Array<RepositorySetting>;
}
