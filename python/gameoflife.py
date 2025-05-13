import random
import os
import time

# -----------------------------------------------------------------------------------------
# This is all the constants
# -----------------------------------------------------------------------------------------
BOARD_WIDTH = 80             # The width of the board
BOARD_HEIGHT = 25            # The height of the board
ACTIVE_CELLS_AT_START = 900  # How many cells should be alive when we start

# -----------------------------------------------------------------------------------------
# This is the grid where we store dead cells and living cells
# If a cell is dead, the boolean is False
# If a cell is alive, the boolean is True
# -----------------------------------------------------------------------------------------
board = [[False for _ in range(BOARD_HEIGHT)] for _ in range(BOARD_WIDTH)]

# -----------------------------------------------------------------------------------------
# This is all the functions that make the simulation work
# -----------------------------------------------------------------------------------------

# Recalculate a new board based on the values of the current board
def step_simulation(current_board):
    new_board = [[False for _ in range(BOARD_HEIGHT)] for _ in range(BOARD_WIDTH)]
    for x in range(BOARD_WIDTH):
        for y in range(BOARD_HEIGHT):
            new_board[x][y] = calculate_cell_life(current_board, x, y)
    return new_board

# This is the actual simulation: Calculating if one cell must live or die
def calculate_cell_life(board, x, y):
    # Count how many neighbors are alive
    neighbors = count_neighbors(board, x, y)
    
    # If current cell is alive:
    if board[x][y]:
        # 0 or 1 neighbors: Die of loneliness
        if neighbors <= 1:
            return False
        # 4 or more neighbors: Die of overpopulation
        if neighbors >= 4:
            return False
        return True
    # If current cell is not alive:
    else:
        # 3 neighbors give birth to a new cell
        if neighbors == 3:
            return True
        return False

# Count how many neighbors are alive
def count_neighbors(board, x, y):
    ac = 0
    # Double loop from 1 up and 1 left to 1 down and 1 right
    # Gives 9 iterations
    for i in range(x - 1, x + 2):
        for j in range(y - 1, y + 2):
            # Only count cells within the board (is_valid_index)
            # and do not count the cell itself (is_yourself)
            if is_valid_index(i, j) and not is_yourself(x, y, i, j) and board[i][j]:
                ac += 1
    return ac

# Return true if the coordinate is within the board
def is_valid_index(x, y):
    return 0 <= x < BOARD_WIDTH and 0 <= y < BOARD_HEIGHT

# Return true if the coordinate is the current cell being investigated
def is_yourself(x, y, i, j):
    return x == i and y == j

# Draw one cell
def draw_cell(x, y, is_alive):
    # Move cursor to position
    print(f"\033[{y+1};{x+1}H", end="")
    if is_alive:
        print("P", end="")
    else:
        print(" ", end="")

# -----------------------------------------------------------------------------------------
# This is the main code
# -----------------------------------------------------------------------------------------

# Clear the screen
os.system('cls' if os.name == 'nt' else 'clear')

# Step 1: Populate a number of cells to begin with
for i in range(ACTIVE_CELLS_AT_START):
    board[random.randint(0, BOARD_WIDTH-1)][random.randint(0, BOARD_HEIGHT-1)] = True

# Hide cursor
print("\033[?25l", end="")

try:
    # Step 2: Run an infinite loop that progresses the game of life
    while True:
        # Draw the board
        for y in range(BOARD_HEIGHT):
            for x in range(BOARD_WIDTH):
                draw_cell(x, y, board[x][y])
        
        # Make one move
        board = step_simulation(board)
        
        # Flush the output and add a small delay
        print(flush=True)
        # Add a small delay to slow down the simulation
        time.sleep(0.1)
        
except KeyboardInterrupt:
    # Show cursor again when exiting
    print("\033[?25h", end="")
    print("\nExiting Game of Life simulation.")