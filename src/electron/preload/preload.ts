import { contextBridge, shell } from 'electron'
import { LocalStorageAccessor } from '../../application/domain/interface/localStorageAccessor'
import { LogUseCase } from '../../application/usecase/log'
import { ElectronStoreWrapper } from './electronStoreWrapper'
import { logger } from './logger'

export interface IPreloadAPI {
  openUrl: (url: string) => void
  initLocalStorageAccessor: (namePostfix?: string) => LocalStorageAccessor
  initLogger: () => LogUseCase
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
