import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { newLocalStorageAccessor } from '@/domain/interface/factory'
import { ApplicationSetting } from '@/model/application'

export class ApplicationSettingService {
  #localStorageAccessor: LocalStorageAccessor = newLocalStorageAccessor()

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
