import { ApplicationSetting } from '@/domain/model/application'
import { Account } from '@/domain/model/github'

export interface AccountSettingUseCase {
  setAccount (account: Account): void
  getAccount (): Account
  deleteSetting (): void
}

export interface AccountSettingUseCaseFactory {
  newAccountSettingUseCase (setting: ApplicationSetting): AccountSettingUseCase
}
