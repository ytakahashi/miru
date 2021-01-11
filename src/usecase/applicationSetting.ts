import { ApplicationSetting } from '@/domain/model/application'

export interface ApplicationSettingUseCase {
  hasSetting (setting: ApplicationSetting): boolean
  getSettings (): Array<ApplicationSetting>
  addSetting (setting: ApplicationSetting): void
  removeSetting (setting: ApplicationSetting): void
}

export interface ApplicationSettingUseCaseFactory {
  newApplicationSettingUseCase (): ApplicationSettingUseCase
}
