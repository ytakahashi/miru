import { contextBridge, shell } from 'electron'
import { LocalStorageAccessor } from '../../application/domain/interface/localStorageAccessor.js'
import { ElectronStoreWrapper } from './electronStoreWrapper.mjs'
import { Logger, logger } from './logger.mjs'

export interface IPreloadAPI {
  openUrl: (url: string) => void
  initLocalStorageAccessor: (namePostfix?: string) => LocalStorageAccessor
  initLogger: () => Logger
}

const preloadApi: IPreloadAPI = {
  openUrl: async (url: string) => {
    await shell.openExternal(url)
  },
  initLocalStorageAccessor: (namePostfix?: string) => {
    return new ElectronStoreWrapper(namePostfix)
  },
  initLogger: () => {
    return logger
  },
}

contextBridge.exposeInMainWorld('preloadApi', preloadApi)
