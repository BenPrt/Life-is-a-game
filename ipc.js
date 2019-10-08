const electron = require('electron');
const ipcMain = electron.ipcMain;

console.log('ipcMain Module called');

let grid = [];

ipcMain.on('generate-grid', event => {
  grid = [];
  for (let row = 0; row < 30; row += 1) {
    const rowValues = [];
    for (let col = 0; col < 30; col += 1) {
      rowValues.push(0);
    }
    grid.push(rowValues);
  }
  event.sender.send('update-grid', grid);
});

ipcMain.on('toggle-cell', (event, arg) => {
  console.log(`x : ${arg[0]} y : ${[arg[1]]}`);
  console.log(`value : ${grid[arg[0]][arg[1]]}`);
  grid[arg[0]][arg[1]] = grid[arg[0]][arg[1]] === 0 ? 1 : 0;
  event.sender.send('update-grid', grid);
});
