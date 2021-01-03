import { LocalStorageAccessor } from '@/domain/interface/localStorageAccessor'
import { newLocalStorageAccessor } from '@/domain/interface/factory'
import { ApplicationSetting } from '@/model/application'

export class ApplicationSettingService {
  #localStorageAccessor: LocalStorageAccessor = newLocalStorageAccessor()

  getSettings = (): Array<ApplicationSetting> => {
    return this.#localStorageAccessor.getApplicationSettings()
  }

  addSetting = (setting: ApplicationSetting) => {
    const current = this.#localStorageAccessor.getApplicationSettings()
    const next = current.concat(setting)
    this.#localStorageAccessor.setApplicationSettings(next)
  }
}
