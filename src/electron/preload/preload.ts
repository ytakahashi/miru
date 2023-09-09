import { contextBridge, shell } from 'electron'
import { LocalStorageAccessor } from '../../application/domain/interface/localStorageAccessor'
import { ElectronStoreWrapper } from './electronStoreWrapper'
import { Logger, logger } from './logger'

export interface IPreloadAPI {
  openUrl: (url: string) => void
  initLocalStorageAccessor: (namePostfix?: string) => LocalStorageAccessor
  initLogger: () => Logger
}

const preloadApi: IPreloadAPI = {
  openUrl: (url: string) => {
    shell.openExternal(url)
  },
  initLocalStorageAccessor: (namePostfix?: string) => {
    return new ElectronStoreWrapper(namePostfix)
  },
  initLogger: () => {
    return logger
  },
}

contextBridge.exposeInMainWorld('preloadApi', preloadApi)
