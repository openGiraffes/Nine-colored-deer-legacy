import { BrowserWindow, Menu, app, globalShortcut, ipcMain, session, shell } from 'electron';
import { download } from 'electron-dl';
import { Device } from './main/device';

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;


ipcMain.handle('device-info', async (_) => {
  console.log('device-info');
  const device = new Device();

  await device.connect();
  const info = await device.getDeviceInfo();
  device.disconnect();

  return info;
});

ipcMain.handle('device-running-apps', async (_) => {
  console.log('device-running-apps');
  const device = new Device();

  await device.connect();
  const apps = await device.getRunningApps();
  device.disconnect();

  return apps;
});

ipcMain.handle('device-installed-apps', async (_) => {
  console.log('device-installed-apps');
  const device = new Device();

  await device.connect();
  const apps = await device.getInstalledApps();
  device.disconnect();

  return apps;
});

ipcMain.handle('device-install', async (_, url: string) => {
  console.log('device-install', url);
  const device = new Device();

  await device.connect();
  await device.installPackagedAppFromUrl(url, `${new Date().valueOf()}`);
  device.disconnect();
});

ipcMain.handle('device-install-local', async (_, filePath: string) => {
  console.log('device-install-local', filePath);
  const device = new Device();

  await device.connect();
  await device.installPackagedApp(filePath, `${new Date().valueOf()}`);
  device.disconnect();
});

ipcMain.handle('device-uninstall', async (_, appId: string) => {
  console.log('device-uninstall', appId);
  const device = new Device();
  await device.connect();
  await device.uninstallApp(appId);
  device.disconnect();
});

ipcMain.handle('device-launch-app', async (_, appId: string) => {
  console.log('device-launch-app', appId);
  const device = new Device();
  await device.connect();
  await device.launchApp(appId);
  device.disconnect();
});

ipcMain.handle('device-close-app', async (_, appId: string) => {
  console.log('device-close-app', appId);
  const device = new Device();
  await device.connect();
  await device.closeApp(appId);
  device.disconnect();
});

ipcMain.handle('open-url', async (_, url: string) => {
  console.log('open-url', url);
  await shell.openExternal(url);
});

ipcMain.handle('download-url', async ({ sender }, url: string) => {
  console.log('download-url', url);
  const win = BrowserWindow.fromWebContents(sender);
  if (!win) {
    throw new Error('BrowserWindow not found');
  }
  // would be better if
  await download(win, url, { saveAs: true });
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// const menuTemplate: any[] = [
//   {
//     label: 'Device',
//     submenu: [{ label: 'TODO' }],
//   },
// ];
// const isMac = process.platform === 'darwin';
// if (isMac) {
//   menuTemplate.unshift({
//     label: app.name,
//     submenu: [
//       { role: 'about' },
//       { type: 'separator' },
//       { role: 'services' },
//       { type: 'separator' },
//       { role: 'hide' },
//       { role: 'hideOthers' },
//       { role: 'unhide' },
//       { type: 'separator' },
//       { role: 'quit' },
//     ],
//   });
// }

const createWindow = (): void => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'access-control-allow-origin': '*',
        'Content-Security-Policy': [
          app.isPackaged
            ? "default-src 'self' 'unsafe-inline' data:; script-src 'self' data:; img-src 'self' https://banana-hackers.gitlab.io data:; connect-src 'self' https://banana-hackers.gitlab.io https://gitlab.com; "
            : "default-src 'self' 'unsafe-inline' data: https://banana-hackers.gitlab.io https://gitlab.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' "
        ],
      },
    });
  });

  Menu.setApplicationMenu (null);
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: app.isPackaged ? 900 : 1400,
    //titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity:false
      // preload: path.join(__dirname, 'preload.js'),
    },

  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (!app.isPackaged) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }
  globalShortcut.register('CommandOrControl+J', () => {
    mainWindow.webContents.openDevTools();
  });
  
  // const menu = Menu.buildFromTemplate(menuTemplate);
  // Menu.setApplicationMenu(menu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
