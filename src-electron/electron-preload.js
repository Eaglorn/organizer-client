/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import os from 'os';
import { contextBridge, ipcRenderer } from 'electron';
import { BrowserWindow } from '@electron/remote';

const child = require('child_process');
let exec = child.exec;

function execute(command, callback) {
  exec('chcp 866 && ' + command, function (error, stdout) {
    let result = null;

    if (!error) {
      splitted = stdout.split('\n');
      console.log(splitted);
      var username = '';
      var fullname = '';

      for (var i = 0; i < splitted.length; i++) {
        if (splitted[i].search('Имя пользователя') != -1) {
          splitted[i] = splitted[i].replace('Имя пользователя', ' ');
          splitted[i] = splitted[i].trim();
          username = splitted[i];
        } else if (splitted[i].search('Полное имя') != -1) {
          splitted[i] = splitted[i].replace('Полное имя', ' ');
          splitted[i] = splitted[i].trim();
          fullname = splitted[i];
        }
      }

      let data = {
        username: username ? username.toLowerCase() : null,
        fullname: fullname ? fullname : null,
      };

      result = data;
    } else {
      result = null;
    }
    callback(result);
  });
}

execute('net user ' + os.userInfo().username + '', (result) => {
  console.log(result);
});

contextBridge.exposeInMainWorld('windowAPI', {
  minimize() {
    BrowserWindow.getFocusedWindow().minimize();
  },

  toggleMaximize() {
    ipcRenderer.send('notify');

    const win = BrowserWindow.getFocusedWindow();

    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  },

  close() {
    BrowserWindow.getFocusedWindow().hide();
  },
});

contextBridge.exposeInMainWorld('userAPI', {
  getData: {
    login: os.userInfo().username,
    computer: os.hostname(),
  },
});
