import { IPreloadAPI } from './electron/preload/preload'

declare global {
  interface Window {
    preloadApi: IPreloadAPI
  }
}
