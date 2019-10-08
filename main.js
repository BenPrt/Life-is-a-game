// ===========================================
// -------------------------------------------
// -----  Window creation and management part

// Libraries imports
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let url = require('url');
const path = require('path');

let mainWindow;

// We check what is the target environment from launching command parameter
const env = process.argv[2];

// Window creation method
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    icon: 'src/assets/Ankama_Logo.png',
    title: 'Ankama Technical Test : An Electron/VueJs Game of Life',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // If there is a "prod" argument in parameters, we load the builded VueJS package
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
    // ..else, we listen to the dev server
    console.log('Starting Dev Environment.....');
    mainWindow.loadURL('http://localhost:8080');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// -----------------------------------------
// Window behaviour methods
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

// =========================================
// -----------------------------------------
// -----  IPC methods

// Ipc Main process import
const ipcMain = electron.ipcMain;

// App parameter
let grid = [];
let height = 1;
let width = 1;
let speed = 1;

let isPlaying = false;

// IPC interceptors for updating parameters (height, width and speed)
ipcMain.on('update-height', (event, arg) => {
  height = arg;
  generateGrid();
  mainWindow.webContents.send('update-grid', grid);
});
ipcMain.on('update-width', (event, arg) => {
  width = arg;
  generateGrid();
  mainWindow.webContents.send('update-grid', grid);
});
ipcMain.on('update-speed', (event, arg) => {
  speed = arg;
  generateGrid();
  mainWindow.webContents.send('update-grid', grid);
});

// IPC interceptor for the first grid generation
ipcMain.on('generate-grid', event => {
  generateGrid();
  event.sender.send('update-grid', grid);
});

// IPC interceptor for toggling alive/dead cell
ipcMain.on('toggle-cell', (event, arg) => {
  grid[arg[0]][arg[1]] = grid[arg[0]][arg[1]] === 0 ? 1 : 0;
  event.sender.send('update-grid', grid);
});

// IPC interceptors for game status
ipcMain.on('play-game', event => {
  isPlaying = true;
  event.sender.send('played-game');
  playGame();
  mainWindow.webContents.send('update-grid', grid);
});
ipcMain.on('play-next', event => {
  playNextStep();
  mainWindow.webContents.send('update-grid', grid);
});
ipcMain.on('pause-game', event => {
  isPlaying = false;
  event.sender.send('paused-game');
});

// IPC interceptor for game reset
ipcMain.on('reset-game', event => {
  isPlaying = false;
  mainWindow.webContents.send('reseted-game');
});

// Grid generation method, based on height and width parameters
generateGrid = function() {
  grid = [];
  for (let row = 0; row < height; row += 1) {
    const rowValues = [];
    for (let col = 0; col < width; col += 1) {
      rowValues.push(0);
    }
    grid.push(rowValues);
  }
  if (grid[0].length >= 3 && grid.length >= 3) {
    const gliderRowIdx = Math.round(Math.random() * (height - 1 - 2) + 2);
    const gliderColIdx = Math.round(Math.random() * (width - 3) + 0);
    generateGlider(gliderRowIdx, gliderColIdx);
  }
};

generateGlider = function(row, col) {
  grid[row][col] = 1;
  grid[row][col + 1] = 1;
  grid[row][col + 2] = 1;
  grid[row - 2][col + 1] = 1;
  grid[row - 1][col + 2] = 1;
};

playGame = function() {
  grid = getNextGen();
};

playNextStep = function() {
  grid = getNextGen();
};

getNextGen = function() {
  console.log('LETS GET NEXT GEN');
  // Next grid initialisation
  let nextGrid = [];
  for (let i = 0; i < grid.length; i++) {
    nextGrid[i] = new Array(grid[i].length);
  }
  // For each cell of the actual grid...
  for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
    for (let colIdx = 0; colIdx < width; colIdx += 1) {
      // ...let's count how many neighbours the current cell have
      let neighNb = getNeighboursCount(rowIdx, colIdx);

      // Now, let's define next value for the cell according to its current neighbour number
      cellValue = grid[rowIdx][colIdx];
      switch (neighNb) {
        case 0:
        case 1:
          cellValue = 0;
          break;
        case 2:
          break;
        case 3:
          cellValue = 1;
          console.log(`cell [${rowIdx},${colIdx}] is now alive!`);
          break;
        default:
          cellValue = 0;
      }
      nextGrid[rowIdx][colIdx] = cellValue;
    }
  }
  return nextGrid;
};

getNeighboursCount = function(row, col) {
  let neighbors = [];

  neighbors = [
    getNeighbour(row, col, -1, -1),
    getNeighbour(row, col, -1, 0),
    getNeighbour(row, col, -1, 1),
    getNeighbour(row, col, 0, -1),
    getNeighbour(row, col, 0, 1),
    getNeighbour(row, col, 1, -1),
    getNeighbour(row, col, 1, 0),
    getNeighbour(row, col, 1, 1),
  ];
  const sum = (a, b) => a + b;

  return neighbors.reduce(sum);
};

getNeighbour = function(row_actual, col_actual, vert_shift, hori_shift) {
  let row;
  let column;
  if (row_actual + vert_shift < 0) {
    row = height - 1;
  } else if (row_actual + vert_shift > height - 1) {
    row = 0;
  } else {
    row = row_actual + vert_shift;
  }

  if (col_actual + hori_shift < 0) {
    column = width - 1;
  } else if (col_actual + hori_shift > width - 1) {
    column = 0;
  } else {
    column = col_actual + hori_shift;
  }

  return grid[row][column];
};
