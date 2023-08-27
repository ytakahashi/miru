import { WebBrowserUserCase } from '@/application/usecase/webBrowser'

export class WebBrowserUserCaseInteractor implements WebBrowserUserCase {
  openUrl(url: string): void {
    window.preloadApi.openUrl(url)
  }
}
