import type { Board } from '../types/cell';

/** Represents the state of the Game of Life board. */

/**
 * Calculates the number of live neighbours for a given cell.
 * Assumes a non-wrapping (finite) board. Cells outside the boundary are considered dead.
 *
 * @param board The current board state.
 * @param row The row index of the cell.
 * @param col The column index of the cell.
 * @returns The count of live neighbours.
 */
const countLiveNeighbors = (board: Board, row: number, col: number): number => {
  const numRows = board.length;
  const numCols = board[0]?.length ?? 0;
  let count = 0;

  // Check all 8 neighboring cells
  const directions = [
    [-1, -1], [-1, 0], [-1, 1], // Top-left, top, top-right
    [0, -1],           [0, 1],  // Left, right
    [1, -1],  [1, 0],  [1, 1]   // Bottom-left, bottom, bottom-right
  ];

  for (const [rowOffset, colOffset] of directions) {
    // Calculate neighbor coordinates directly
    const neighborRow = row + rowOffset;
    const neighborCol = col + colOffset;

    // Check if the neighbor is within the grid boundaries
    if (
      neighborRow >= 0 &&
      neighborRow < numRows &&
      neighborCol >= 0 &&
      neighborCol < numCols
    ) {
      // If the neighbor is within bounds and alive, increment count
      if (board[neighborRow][neighborCol]) {
        count++;
      }
    }
    // Neighbors outside the bounds are considered dead (count remains unchanged)
  }

  return count;
};

/**
 * Calculates the next generation of the Game of Life board based on Conway's rules.
 *
 * Rules:
 * 1. Any live cell with fewer than two live neighbours dies (underpopulation).
 * 2. Any live cell with two or three live neighbours lives on to the next generation.
 * 3. Any live cell with more than three live neighbours dies (overpopulation).
 * 4. Any dead cell with exactly three live neighbours becomes a live cell (reproduction).
 *
 * @param currentBoard The current state of the board (2D array of booleans).
 * @returns A new board representing the next generation.
 */
export const getNextGeneration = (currentBoard: Board): Board => {
  // Handle empty or invalid board input gracefully
  if (
    !currentBoard ||
    currentBoard.length === 0 ||
    !currentBoard[0] ||
    currentBoard[0].length === 0
  ) {
    console.warn('getNextGeneration received an empty or invalid board.');
    return [];
  }

  const numRows = currentBoard.length;
  const numCols = currentBoard[0].length;
  
  // Create a new board initialized to the same dimensions
  // Important: We need to make a completely new board, not modify the existing one
  const newBoard: Board = Array.from({ length: numRows }, () =>
    Array(numCols).fill(false)
  );

  // Iterate through each cell of the current board to calculate its next state
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const isAlive = currentBoard[row][col];
      const liveNeighbors = countLiveNeighbors(currentBoard, row, col);

      // Apply Conway's Game of Life rules
      if (isAlive) {
        // Rule 1 & Rule 2: Live cell with 2 or 3 live neighbors survives
        if (liveNeighbors === 2 || liveNeighbors === 3) {
          newBoard[row][col] = true; // Cell survives
        }
        // Rule 3: Live cell with <2 or >3 neighbors dies (implied by default false state)
      } else {
        // Rule 4: Dead cell with exactly 3 live neighbors becomes alive
        if (liveNeighbors === 3) {
          newBoard[row][col] = true; // Cell is born
        }
      }
    }
  }
  
  return newBoard;
};
