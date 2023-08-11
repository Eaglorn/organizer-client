import { app, BrowserWindow, nativeTheme, Menu, Tray } from 'electron';
import { initialize, enable } from '@electron/remote/main';
import path from 'path';
import os from 'os';

initialize();

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions'),
    );
  }
} catch (_) {}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.removeMenu();

  enable(mainWindow.webContents);

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
    //mainWindow.webContents.closeDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.minimize();
  });

  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.minimize();
  });
}

let tray = null;

app
  .whenReady()
  .then(createWindow)
  .then(() => {
    tray = new Tray(path.resolve(__dirname, 'icons/icon.png'));
    tray.setToolTip('Органайзер');
    var contextMenu = Menu.buildFromTemplate([
      {
        label: 'Выйти из приложения',
        click: function () {
          try {
            app.exit();
            tray.destroy();
            mainWindow.destroy();
            tray = null;
            mainWindow = null;
          } catch {}
        },
      },
    ]);
    tray.setContextMenu(contextMenu);
    tray.setIgnoreDoubleClickEvents(true);
    tray.on('click', function (e) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    });
  });

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
