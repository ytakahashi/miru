import { shell } from 'electron'
import { WebBrowser } from '../../application/domain/interface/webBrowser.js'

class WebBrowserImpl implements WebBrowser {
  openUrl = async (url: string): Promise<void> => {
    await shell.openExternal(url)
  }
}

export const webBrowser = new WebBrowserImpl()
