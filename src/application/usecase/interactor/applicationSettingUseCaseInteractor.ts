import { LocalStorageAccessor } from '@/application/domain/interface/localStorageAccessor.js'
import { ApplicationSetting } from '@/application/domain/model/application.js'
import { ApplicationSettingUseCase } from '@/application/usecase/applicationSetting.js'

export class ApplicationSettingUseCaseInteractor implements ApplicationSettingUseCase {
  #localStorageAccessor: LocalStorageAccessor

  constructor(localStorageAccessor: LocalStorageAccessor) {
    this.#localStorageAccessor = localStorageAccessor
  }

  hasSetting = (setting: ApplicationSetting): boolean => {
    const current = this.#localStorageAccessor.getApplicationSettings()
    return current.some(s => setting.equals(s))
  }

  getSettings = (): Array<ApplicationSetting> => {
    return this.#localStorageAccessor.getApplicationSettings()
  }

  addSetting = (setting: ApplicationSetting): void => {
    const current = this.#localStorageAccessor.getApplicationSettings()
    const next = current.concat(setting)
    this.#localStorageAccessor.setApplicationSettings(next)
  }

  removeSetting = (setting: ApplicationSetting): void => {
    const current = this.#localStorageAccessor.getApplicationSettings()
    const next = current.filter(v => v.configPostfix !== setting.configPostfix)
    this.#localStorageAccessor.setApplicationSettings(next)
  }
}
