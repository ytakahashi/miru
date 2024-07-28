import { WebBrowserUserCase } from '@/application/usecase/webBrowser.js'

export class WebBrowserUserCaseInteractor implements WebBrowserUserCase {
  openUrl(url: string): void {
    window.preloadApi.openUrl(url)
  }
}
