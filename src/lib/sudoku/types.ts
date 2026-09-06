export type Difficulty = "facile" | "moyen" | "difficile";

export type CellValue = number; // 0 = empty, 1-9 = filled

export type Board = CellValue[][];

export interface SudokuPuzzle {
  puzzle: Board;
  solution: Board;
  difficulty: Difficulty;
}

export type CellCoord = { row: number; col: number };

export const DIFFICULTY_CLUES: Record<Difficulty, number> = {
  facile: 40,
  moyen: 32,
  difficile: 24,
};
