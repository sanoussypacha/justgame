import type { Board, CellValue } from "./types";

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array<CellValue>(9).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  value: number
): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value || board[i][col] === value) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === value) return false;
    }
  }

  return true;
}

export function findEmptyCell(board: Board): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return [row, col];
    }
  }
  return null;
}

export function solveBoard(board: Board): boolean {
  const empty = findEmptyCell(board);
  if (!empty) return true;

  const [row, col] = empty;
  const numbers = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const value of numbers) {
    if (isValidPlacement(board, row, col, value)) {
      board[row][col] = value;
      if (solveBoard(board)) return true;
      board[row][col] = 0;
    }
  }

  return false;
}

export function countSolutions(board: Board, limit = 2): number {
  const empty = findEmptyCell(board);
  if (!empty) return 1;

  const [row, col] = empty;
  let count = 0;

  for (let value = 1; value <= 9; value++) {
    if (isValidPlacement(board, row, col, value)) {
      board[row][col] = value;
      count += countSolutions(board, limit);
      board[row][col] = 0;
      if (count >= limit) return count;
    }
  }

  return count;
}

export function boardsEqual(a: Board, b: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (a[row][col] !== b[row][col]) return false;
    }
  }
  return true;
}

export function getConflicts(board: Board): Set<string> {
  const conflicts = new Set<string>();

  const markDuplicates = (coords: Array<[number, number]>) => {
    const seen = new Map<number, Array<[number, number]>>();
    for (const [row, col] of coords) {
      const value = board[row][col];
      if (value === 0) continue;
      const list = seen.get(value) ?? [];
      list.push([row, col]);
      seen.set(value, list);
    }
    for (const list of seen.values()) {
      if (list.length > 1) {
        for (const [row, col] of list) {
          conflicts.add(`${row}-${col}`);
        }
      }
    }
  };

  for (let i = 0; i < 9; i++) {
    markDuplicates(Array.from({ length: 9 }, (_, j) => [i, j] as [number, number]));
    markDuplicates(Array.from({ length: 9 }, (_, j) => [j, i] as [number, number]));
  }

  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const coords: Array<[number, number]> = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          coords.push([boxRow * 3 + r, boxCol * 3 + c]);
        }
      }
      markDuplicates(coords);
    }
  }

  return conflicts;
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
