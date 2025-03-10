// -----------------------------------------------------------------------------------------
// This is all the constants
// -----------------------------------------------------------------------------------------
const int BOARD_WIDTH = 80;  // The width of the board
const int BOARD_HEIGHT = 25; // The height of the board
const int ACTIVE_CELLS_AT_START = 900; // How many cells should be alive when we start

// -----------------------------------------------------------------------------------------
// This is the grid where we store dead cells and living cells
// If a cell is dead, the boolean is false
// If a cell is alive, the boolean is true
// -----------------------------------------------------------------------------------------
bool[,] board = new bool[BOARD_WIDTH, BOARD_HEIGHT];

// -----------------------------------------------------------------------------------------
// This is the main code
// -----------------------------------------------------------------------------------------

// Step 1: Populate a number of cells to begin with
for (int i = 0; i < ACTIVE_CELLS_AT_START; i++)
{
  var random = new Random();
  board[random.Next(BOARD_WIDTH), random.Next(BOARD_HEIGHT)] = true;
}

// Step 2: Run an infinite loop that progresses the game of life
while (true)
{
  // Make one move
  board = StepSimulation(board);

  // Draw the new board
  for (int y = 0; y < BOARD_HEIGHT; y++)
  {
    for (int x = 0; x < BOARD_WIDTH; x++)
    {
      DrawCell(x, y, board[x,y]);
    }
  }
}

// -----------------------------------------------------------------------------------------
// This is all the functions that make the simulation work
// -----------------------------------------------------------------------------------------

// Recalculate a new board based on the values
// of the current board
bool[,] StepSimulation(bool[,] currentBoard)
{
  bool[,] newBoard = new bool[BOARD_WIDTH, BOARD_HEIGHT];
  for (int x = 0; x < BOARD_WIDTH; x++)
  {
    for (int y = 0; y < BOARD_HEIGHT; y++)
    {
      newBoard[x, y] = CalculateCellLife(currentBoard, x, y);
    }
  }
  return newBoard;
}

// This is the actual simiulation: Calculating if one cell must live or die
bool CalculateCellLife(bool[,] board, int x, int y)
{
  // Count how many neighbors are alive
  int neighbors = CountNeighbors(board, x, y);

  // If current cell is alive:
  if (board[x, y] == true)
  {
    // 0 or 1 neighbors: Die of loneliness
    if (neighbors <= 1)
      return false;
    // 4 or more neighbors: Die of overpopulation
    if (neighbors >= 4)
      return false;
    return true;
  }
  // If current cell is not alive:
  else
  {
    // 3 neighbors give birth to a new cell
    if (neighbors == 3)
      return true;
    return false;
  }
}

// Count how many neighboars are alive
int CountNeighbors(bool[,] board, int x, int y)
{
  int ac = 0;
  // Double loop from 1 up and 1 left to 1 down and 1 right
  // Gives 9 iterations
  for (int i = x - 1; i <= x + 1; i++)
  {
    for (int j = y - 1; j <= y + 1; j++)
    {
      // Only count cells within the board (IsValidIndex)
      // and do not count the cell itself (IsYourself)
      if (IsValidIndex(i, j)
          && !IsYourself(x, y, i, j)
          && board[i, j])
        ac++;
    }
  }

  return ac;
}

// Return true if the coordinate is within the board
bool IsValidIndex(int x, int y)
{
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

// Return true if the coordinate is the current cell being investigates
bool IsYourself(int x, int y, int i, int j)
{
  return x == i && y == j;
}

// Draw one cell
void DrawCell(int x, int y, bool isAlive)
{
  Console.SetCursorPosition(x, y);
  if (isAlive)
    Console.Write("O");
  else
    Console.Write(" ");
}


