const readline = require('readline');

// -----------------------------------------------------------------------------------------
// This is all the constants
// -----------------------------------------------------------------------------------------
const BOARD_WIDTH = 80;  // The width of the board
const BOARD_HEIGHT = 25; // The height of the board
const ACTIVE_CELLS_AT_START = 900; // How many cells should be alive when we start

// -----------------------------------------------------------------------------------------
// This is the grid where we store dead cells and living cells
// If a cell is dead, the boolean is false
// If a cell is alive, the boolean is true
// -----------------------------------------------------------------------------------------
let board = Array(BOARD_WIDTH).fill().map(() => Array(BOARD_HEIGHT).fill(false));

// -----------------------------------------------------------------------------------------
// This is the main code
// -----------------------------------------------------------------------------------------
// Step 1: Populate a number of cells to begin with
for (let i = 0; i < ACTIVE_CELLS_AT_START; i++) {
  const x = Math.floor(Math.random() * BOARD_WIDTH);
  const y = Math.floor(Math.random() * BOARD_HEIGHT);
  board[x][y] = true;
}

// Step 2: Run an infinite loop that progresses the game of life
function runSimulation() {
  // Make one move
  board = stepSimulation(board);
  
  // Draw the new board
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      drawCell(x, y, board[x][y]);
    }
  }
  
  // Loop the simulation
  setTimeout(runSimulation, 1); 
}

// Start the simulation
readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);
runSimulation();

// -----------------------------------------------------------------------------------------
// This is all the functions that make the simulation work
// -----------------------------------------------------------------------------------------

// Recalculate a new board based on the values
// of the current board
function stepSimulation(currentBoard) {
  const newBoard = Array(BOARD_WIDTH).fill().map(() => Array(BOARD_HEIGHT).fill(false));
  
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      newBoard[x][y] = calculateCellLife(currentBoard, x, y);
    }
  }
  
  return newBoard;
}

// This is the actual simulation: Calculating if one cell must live or die
function calculateCellLife(board, x, y) {
  // Count how many neighbors are alive
  const neighbors = countNeighbors(board, x, y);
  
  // If current cell is alive:
  if (board[x][y] === true) {
    // 0 or 1 neighbors: Die of loneliness
    if (neighbors <= 1)
      return false;
    // 4 or more neighbors: Die of overpopulation
    if (neighbors >= 4)
      return false;
    return true;
  }
  // If current cell is not alive:
  else {
    // 3 neighbors give birth to a new cell
    if (neighbors === 3)
      return true;
    return false;
  }
}

// Count how many neighbors are alive
function countNeighbors(board, x, y) {
  let count = 0;
  
  // Double loop from 1 up and 1 left to 1 down and 1 right
  // Gives 9 iterations
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      // Only count cells within the board (isValidIndex)
      // and do not count the cell itself (isYourself)
      if (isValidIndex(i, j) 
          && !isYourself(x, y, i, j)
          && board[i][j]) {
        count++;
      }
    }
  }
  
  return count;
}

// Return true if the coordinate is within the board
function isValidIndex(x, y) {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

// Return true if the coordinate is the current cell being investigated
function isYourself(x, y, i, j) {
  return x === i && y === j;
}

// Draw one cell
function drawCell(x, y, isAlive) {
    // Position cursor and write character
    process.stdout.cursorTo(x, y);
    process.stdout.write(isAlive ? 'J' : ' ');
}