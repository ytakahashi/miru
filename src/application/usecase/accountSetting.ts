import { ApplicationSetting } from '@/application/domain/model/application'
import { Account } from '@/application/domain/model/github'

export interface AccountSettingUseCase {
  setAccount(account: Account): void
  getAccount(): Account
  deleteSetting(): void
}

export interface AccountSettingUseCaseFactory {
  newAccountSettingUseCase(setting: ApplicationSetting): AccountSettingUseCase
}
