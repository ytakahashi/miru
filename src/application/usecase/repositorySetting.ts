import { ApplicationSetting } from '@/application/domain/model/application.js'
import { RepositorySetting } from '@/application/domain/model/githubRepository.js'

export interface RepositorySettingUseCase {
  addRepositorySetting(url: RepositorySetting): boolean
  deleteRepositorySetting(url: RepositorySetting): void
  getRepositorySettings(): Array<RepositorySetting>
  setRepositorySettings(urls: Array<RepositorySetting>): void
}

export interface RepositorySettingUseCaseFactory {
  newRepositorySettingUseCase(setting: ApplicationSetting): RepositorySettingUseCase
}
