import { join } from 'path'
import { app, BrowserWindow } from 'electron'
import Store from 'electron-store'

import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

Store.initRenderer()

const isDev = process.env.npm_lifecycle_event === 'electron:dev' ? true : false

async function createWindow(): Promise<void> {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      sandbox: false,
      preload: join(__dirname, '../preload/preload.mjs'),
    },
  })

  // and load the index.html of the app.
  if (isDev) {
    await mainWindow.loadURL('http://localhost:5173/')
    mainWindow.webContents.openDevTools() // Open the DevTools.
  } else {
    await mainWindow.loadFile(join(__dirname, '../../index.html'))
  }
  // mainWindow.loadURL( //this doesn't work on macOS in build and preview mode
  //     isDev ?
  //     'http://localhost:3000' :
  //     join(__dirname, '../../index.html')
  // );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.whenReady().then(async () => {
  await createWindow()
  app.on('activate', async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
