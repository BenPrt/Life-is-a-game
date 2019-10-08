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
// -----  Algorithm part

// Ipc Main process import
const ipcMain = electron.ipcMain;

// App parameters
let grid = [];
let height = 30;
let width = 30;
let speed = 2;

let isPlaying = false;

// -------------------------------------
// IPC interceptors for updating parameters (height, width and speed)
ipcMain.on('update-height', (event, arg) => {
  updateHeight(arg);
  generateGrid();
  mainWindow.webContents.send('update-grid', grid);
});
ipcMain.on('update-width', (event, arg) => {
  updateWidth(arg);
  generateGrid();
  mainWindow.webContents.send('update-grid', grid);
});
ipcMain.on('update-speed', (event, arg) => {
  updateSpeed(arg);
  mainWindow.webContents.send('update-grid', grid);
});

// -------------------------------------
// IPC interceptor for the first grid generation
ipcMain.on('generate-grid', event => {
  generateGrid();
  event.sender.send('update-grid', grid);
});

// -------------------------------------
// IPC interceptor for toggling alive/dead cell
ipcMain.on('toggle-cell', (event, arg) => {
  toggleCell(arg[0], arg[1]);
  event.sender.send('update-grid', grid);
});

// -------------------------------------
// IPC interceptors for game status
ipcMain.on('play-game', event => {
  event.sender.send('played-game');
  playGame();
  mainWindow.webContents.send('update-grid', grid);
});
ipcMain.on('play-next', event => {
  playNextStep();
  mainWindow.webContents.send('update-grid', grid);
});
ipcMain.on('pause-game', event => {
  pauseGame();
  event.sender.send('paused-game');
});

// -------------------------------------
// IPC interceptor for game reset
ipcMain.on('reset-game', event => {
  pauseGame();
  mainWindow.webContents.send('reseted-game');
});

//-------------------------------------------
// Calculation methods

// Parameters update methods
updateHeight = function(newHeight) {
  height = newHeight;
};
updateWidth = function(newWidth) {
  width = newWidth;
};
updateSpeed = function(newSpeed) {
  speed = newSpeed;
  switch (speed) {
    case '0':
      intervalValue = 1500;
      break;
    case '1':
      intervalValue = 700;
      break;
    case '2':
      intervalValue = 500;
      break;
    case '3':
      intervalValue = 200;
      break;
    case '4':
      intervalValue = 0;
      break;
  }
};

// Method toggling cell life
toggleCell = function(row, col) {
  grid[row][col] = grid[row][col] === 0 ? 1 : 0;
};

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

  // If there is enough space, we create a glider on the grid
  if (grid[0].length >= 3 && grid.length >= 3) {
    generateRandomGlider();
  }
};

// Glider random generation method
generateRandomGlider = function() {
  const row = Math.round(Math.random() * (height - 1 - 2) + 2);
  const col = Math.round(Math.random() * (width - 3) + 0);
  grid[row][col] = 1;
  grid[row][col + 1] = 1;
  grid[row][col + 2] = 1;
  grid[row - 2][col + 1] = 1;
  grid[row - 1][col + 2] = 1;
};

// Method firing the automatic play according to the selected speed
playGame = function() {
  isPlaying = true;
  automaticPlay();
};

// Method that repeats automatically
automaticPlay = function() {
  if (isPlaying) {
    playNextStep();
    mainWindow.webContents.send('update-grid', grid);
    setTimeout(() => {
      automaticPlay();
    }, intervalValue);
  }
};

// Method playing the next step in the game
playNextStep = function() {
  grid = getNextGen();
};

// Method pausing the game
pauseGame = function() {
  isPlaying = false;
};

// Method calculating next grid according to the current one
getNextGen = function() {
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
          break;
        default:
          cellValue = 0;
      }
      nextGrid[rowIdx][colIdx] = cellValue;
    }
  }
  return nextGrid;
};

// Method counting the number of alive neighbors of a specific cell
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

// Method returning the neighbour of a cell according to the vertical/horizontal shift passed in parameter
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
