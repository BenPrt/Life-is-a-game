const electron = require('electron');

const ipc = electron.ipcMain;

ipc.on('toggle-cell', (event, arg) => {
  console.log(event, arg);
});
