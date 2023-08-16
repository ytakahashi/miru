import { shell } from 'electron'
import { WebBrowserUserCase } from '@/application/usecase/webBrowser'

export class WebBrowserUserCaseInteractor implements WebBrowserUserCase {
  openUrl(url: string): void {
    shell.openExternal(url)
  }
}
