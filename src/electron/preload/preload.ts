import { contextBridge, shell } from 'electron'
import { ElectronStoreWrapper } from '../../application/infrastructure/impl/electronStoreWrapper'
import { LocalStorageAccessor } from '../../application/domain/interface/localStorageAccessor'

export interface IPreloadAPI {
  openUrl: (url: string) => void
  initElectronStoreWrapper: (namePostfix?: string) => LocalStorageAccessor
}

const preloadApi: IPreloadAPI = {
  openUrl: (url: string) => {
    shell.openExternal(url)
  },
  initElectronStoreWrapper: (namePostfix?: string) => {
    return new ElectronStoreWrapper(namePostfix)
  },
}

contextBridge.exposeInMainWorld('preloadApi', preloadApi)
