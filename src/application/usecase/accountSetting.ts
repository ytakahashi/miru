import { ApplicationSetting } from '@/application/domain/model/application.js'
import { Account } from '@/application/domain/model/github.js'

export interface AccountSettingUseCase {
  setAccount(account: Account): void
  getAccount(): Account
  deleteSetting(): void
}

export interface AccountSettingUseCaseFactory {
  newAccountSettingUseCase(setting: ApplicationSetting): AccountSettingUseCase
}
