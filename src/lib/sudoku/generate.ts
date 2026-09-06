import {
  cloneBoard,
  countSolutions,
  createEmptyBoard,
  solveBoard,
} from "./engine";
import {
  DIFFICULTY_CLUES,
  type Difficulty,
  type SudokuPuzzle,
} from "./types";

export function generatePuzzle(difficulty: Difficulty): SudokuPuzzle {
  const solution = createEmptyBoard();
  solveBoard(solution);

  const puzzle = cloneBoard(solution);
  const cells = shuffledCoords();
  const targetClues = DIFFICULTY_CLUES[difficulty];
  let remaining = 81;

  for (const [row, col] of cells) {
    if (remaining <= targetClues) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    const test = cloneBoard(puzzle);
    if (countSolutions(test, 2) !== 1) {
      puzzle[row][col] = backup;
      continue;
    }

    remaining -= 1;
  }

  return {
    puzzle,
    solution,
    difficulty,
  };
}

function shuffledCoords(): Array<[number, number]> {
  const coords: Array<[number, number]> = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      coords.push([row, col]);
    }
  }

  for (let i = coords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [coords[i], coords[j]] = [coords[j], coords[i]];
  }

  return coords;
}
