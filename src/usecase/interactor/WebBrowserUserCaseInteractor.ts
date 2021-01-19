import { shell } from 'electron'
import { WebBrowserUserCase } from '@/usecase/webBrowser'

export class WebBrowserUserCaseInteractor implements WebBrowserUserCase {
  openUrl (url: string): void {
    shell.openExternal(url)
  }
}
