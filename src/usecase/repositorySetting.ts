import { ApplicationSetting } from '@/domain/model/application'
import { RepositoryUrl } from '@/domain/model/githubRepository'

export interface RepositorySettingUseCase {
  addRepositoryUrl (url: RepositoryUrl): void
  deleteRepositoryUrl (url: RepositoryUrl): void
  getRepositoryUrls (): Array<RepositoryUrl>
  setRepositoryUrls (urls: Array<RepositoryUrl>): void
}

export interface RepositorySettingUseCaseFactory {
  newRepositorySettingUseCase (setting: ApplicationSetting): RepositorySettingUseCase
}
