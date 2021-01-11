import { ApplicationSetting } from '@/domain/model/application'
import { Account } from '@/domain/model/github'
import { RepositoryUrl } from '@/domain/model/githubRepository'

export interface AccountSettingUseCase {
  addRepositoryUrl (url: RepositoryUrl): void
  deleteRepositoryUrl (url: RepositoryUrl): void
  getRepositoryUrls (): Array<RepositoryUrl>
  clearRepositoryUrls (): void
  setAccount (account: Account): void
  getAccount (): Account
  deleteSetting (): void
}

export interface AccountSettingUseCaseFactory {
  newAccountSettingUseCase (setting: ApplicationSetting): AccountSettingUseCase
}
