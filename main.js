const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let url = require('url');
const path = require('path');
let mainWindow;

const env = process.argv[2];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    icon: 'src/assets/Ankama_Logo.png',
    title: 'Life is a game',
  });

  if (env === 'prod') {
    console.log('Building production.....');
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  } else {
    console.log('Starting Dev Environment.....');
    mainWindow.loadURL('http://localhost:8080');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
