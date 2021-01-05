import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { newLocalStorageAccessor } from '@/domain/interface/factory'
import { ApplicationSetting } from '@/model/application'

export class ApplicationSettingService {
  #localStorageAccessor: LocalStorageAccessor

  constructor (localStorageAccessor?: LocalStorageAccessor) {
    this.#localStorageAccessor =
      localStorageAccessor === undefined
        ? newLocalStorageAccessor()
        : localStorageAccessor
  }

  getSettings = (): Array<ApplicationSetting> => {
    return this.#localStorageAccessor.getApplicationSettings()
  }

  addSetting = (setting: ApplicationSetting): boolean => {
    const current = this.#localStorageAccessor.getApplicationSettings()
    const exists = current.some(s => s.equals(setting))
    if (exists) {
      return false
    }
    const next = current.concat(setting)
    this.#localStorageAccessor.setApplicationSettings(next)
    return true
  }

  removeSetting = (setting: ApplicationSetting): void => {
    const current = this.#localStorageAccessor.getApplicationSettings()
    const next = current.filter(v => v.configPostfix !== setting.configPostfix)
    this.#localStorageAccessor.setApplicationSettings(next)
  }
}
