import { ApplicationSetting } from '@/application/domain/model/application'
import { GitHubAccount, RepositorySetting } from '@/application/infrastructure/dto/local'

export interface LocalStorageAccessor {
  setApplicationSettings(settings: Array<ApplicationSetting>): void
  getApplicationSettings(): Array<ApplicationSetting>
  setGitHubAccount(account: GitHubAccount): void
  getGitHubAccount(): GitHubAccount | undefined
  setRepositorySettings(settings: Array<RepositorySetting>): void
  getRepositorySettings(): Array<RepositorySetting>
  deleteSettings(): void
}
