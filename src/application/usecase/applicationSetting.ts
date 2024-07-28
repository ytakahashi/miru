import { ApplicationSetting } from '@/application/domain/model/application.js'

export interface ApplicationSettingUseCase {
  hasSetting(setting: ApplicationSetting): boolean
  getSettings(): Array<ApplicationSetting>
  addSetting(setting: ApplicationSetting): void
  removeSetting(setting: ApplicationSetting): void
}

export interface ApplicationSettingUseCaseFactory {
  newApplicationSettingUseCase(): ApplicationSettingUseCase
}
