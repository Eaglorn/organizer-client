import {
  app,
  BrowserWindow,
  nativeTheme,
  Menu,
  Tray,
  dialog,
  ipcMain,
  Notification,
} from 'electron'
const { autoUpdater } = require('electron-updater')
import { initialize, enable } from '@electron/remote/main'
import path from 'path'
import os from 'os'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true

initialize()

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    )
  }
} catch (_) {}

app.setAppUserModelId('Органайзер')

let mainWindow

function createWindow() {
  const { screen } = require('electron')

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: width,
    height: height,
    useContentSize: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  })

  mainWindow.removeMenu()

  enable(mainWindow.webContents)

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
    //mainWindow.webContents.closeDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('minimize', (event) => {
    event.preventDefault()
    mainWindow.minimize()
  })

  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow.minimize()
  })
}

let tray = null

app
  .whenReady()
  .then(createWindow)
  .then(() => {
    tray = new Tray(path.resolve(__dirname, 'icons/icon.png'))
    tray.setToolTip('Органайзер')
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Выйти из приложения',
        click: function () {
          try {
            app.exit()
            tray.destroy()
            mainWindow.destroy()
            tray = null
            mainWindow = null
          } catch {}
        },
      },
    ])
    tray.setContextMenu(contextMenu)
    tray.setIgnoreDoubleClickEvents(true)
    tray.on('click', function (e) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    })
  })

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

if (app.isPackaged) {
  setInterval(
    () => {
      autoUpdater.checkForUpdates()
    },
    60 * 1000 * 60 * 24
  )

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Перезагрузить', 'Позднее'],
      title: 'Обновление приложения Органайзер ВКС',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'Загружена новая версия приложения. Необходима перезагрузка приложения для установки обновления.',
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('error', (message) => {
    console.error('Возникла проблема при обновлении приложения.')
    console.error(message)
  })
}

ipcMain.on('notify', () => {
  try {
    /*const notify = new Notification({
      title: 'Измение состояния приложения',
      body: 'Нажата кнопка изменения размера окна приложения',
      timeoutType: 'never',
    });
    notify.show();*/
  } catch (err) {
    console.log(err)
  }
})
