import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { newLocalStorageAccessor } from '@/domain/interface/factory'
import { ApplicationSetting } from '@/domain/model/application'

export class ApplicationSettingService {
  #localStorageAccessor: LocalStorageAccessor

  constructor (localStorageAccessor?: LocalStorageAccessor) {
    this.#localStorageAccessor =
      localStorageAccessor === undefined
        ? newLocalStorageAccessor()
        : localStorageAccessor
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