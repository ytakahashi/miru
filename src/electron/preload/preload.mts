import { contextBridge } from 'electron'
import { LocalStorageAccessor } from '../../application/domain/interface/localStorageAccessor.js'
import { Logger } from '../../application/domain/interface/logger.js'
import { WebBrowser } from '../../application/domain/interface/webBrowser.js'
import { ElectronStoreWrapper } from './electronStoreWrapper.mjs'
import { logger } from './logger.mjs'
import { webBrowser } from './webBrowser.mjs'

export interface IPreloadAPI {
  initLocalStorageAccessor: (namePostfix?: string) => LocalStorageAccessor
  initLogger: () => Logger
  initWebBrowser: () => WebBrowser
}

const preloadApi: IPreloadAPI = {
  initLocalStorageAccessor: (namePostfix?: string) => {
    return new ElectronStoreWrapper(namePostfix)
  },
  initLogger: () => {
    return logger
  },
  initWebBrowser: () => {
    return webBrowser
  },
}

contextBridge.exposeInMainWorld('preloadApi', preloadApi)
