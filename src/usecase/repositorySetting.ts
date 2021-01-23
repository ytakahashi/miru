import { ApplicationSetting } from '@/domain/model/application'
import { RepositorySetting } from '@/domain/model/githubRepository'

export interface RepositorySettingUseCase {
  addRepositorySetting (url: RepositorySetting): boolean
  deleteRepositorySetting (url: RepositorySetting): void
  getRepositorySettings (): Array<RepositorySetting>
  setRepositorySettings (urls: Array<RepositorySetting>): void
}

export interface RepositorySettingUseCaseFactory {
  newRepositorySettingUseCase (setting: ApplicationSetting): RepositorySettingUseCase
}
