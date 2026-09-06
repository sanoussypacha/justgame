"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { boardsEqual, cloneBoard, getConflicts } from "@/lib/sudoku/engine";
import { generatePuzzle } from "@/lib/sudoku/generate";
import type { Board, CellCoord, Difficulty } from "@/lib/sudoku/types";

const DIFFICULTIES: Difficulty[] = ["facile", "moyen", "difficile"];

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("facile");
  const [puzzle, setPuzzle] = useState<Board | null>(null);
  const [solution, setSolution] = useState<Board | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [selected, setSelected] = useState<CellCoord>({ row: 0, col: 0 });
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [won, setWon] = useState(false);
  const [notes, setNotes] = useState("Sélectionnez une case, puis un chiffre.");

  const startGame = useCallback((nextDifficulty: Difficulty) => {
    const generated = generatePuzzle(nextDifficulty);
    setDifficulty(nextDifficulty);
    setPuzzle(cloneBoard(generated.puzzle));
    setSolution(cloneBoard(generated.solution));
    setBoard(cloneBoard(generated.puzzle));
    setSelected({ row: 0, col: 0 });
    setSeconds(0);
    setPaused(false);
    setWon(false);
    setNotes("Nouvelle partie prête. Bonne chance !");
  }, []);

  useEffect(() => {
    startGame("facile");
  }, [startGame]);

  useEffect(() => {
    if (paused || won || !board) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paused, won, board]);

  const conflicts = useMemo(
    () => (board ? getConflicts(board) : new Set<string>()),
    [board]
  );

  const filledCount = useMemo(() => {
    if (!board) return 0;
    return board.flat().filter((value) => value !== 0).length;
  }, [board]);

  const isFixed = useCallback(
    (row: number, col: number) => Boolean(puzzle && puzzle[row][col] !== 0),
    [puzzle]
  );

  const placeValue = useCallback(
    (value: number) => {
      if (!board || !solution || paused || won) return;
      const { row, col } = selected;
      if (isFixed(row, col)) {
        setNotes("Cette case fait partie de la grille initiale.");
        return;
      }

      const next = cloneBoard(board);
      next[row][col] = value;
      setBoard(next);

      if (boardsEqual(next, solution)) {
        setWon(true);
        setNotes("Bravo ! Grille complétée.");
      } else if (value !== 0 && next[row][col] !== solution[row][col]) {
        setNotes("Chiffre placé — vérifiez les conflits éventuels.");
      } else {
        setNotes(value === 0 ? "Case effacée." : "Chiffre placé.");
      }
    },
    [board, solution, paused, won, selected, isFixed]
  );

  const moveSelection = useCallback(
    (rowDelta: number, colDelta: number) => {
      setSelected((current) => ({
        row: Math.min(8, Math.max(0, current.row + rowDelta)),
        col: Math.min(8, Math.max(0, current.col + colDelta)),
      }));
    },
    []
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!board || paused) return;

      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection(-1, 0);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelection(1, 0);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection(0, -1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(0, 1);
      } else if (/^[1-9]$/.test(event.key)) {
        placeValue(Number(event.key));
      } else if (
        event.key === "Backspace" ||
        event.key === "Delete" ||
        event.key === "0"
      ) {
        placeValue(0);
      } else if (event.key.toLowerCase() === "p") {
        setPaused((value) => !value);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [board, paused, moveSelection, placeValue]);

  if (!board || !puzzle) {
    return (
      <div className="panel board-panel">
        <p>Génération de la grille…</p>
      </div>
    );
  }

  const selectedValue = board[selected.row][selected.col];

  return (
    <div className="sudoku-layout">
      <section className="panel board-panel">
        <div className="game-header">
          <h1>Partie en cours</h1>
          <button
            className="icon-btn"
            type="button"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? "Reprendre" : "Pause"}
          </button>
        </div>

        <div className="sudoku-board" role="grid" aria-label="Grille de Sudoku">
          {board.map((row, rowIndex) =>
            row.map((value, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const selectedCell =
                selected.row === rowIndex && selected.col === colIndex;
              const related =
                selected.row === rowIndex ||
                selected.col === colIndex ||
                (Math.floor(selected.row / 3) === Math.floor(rowIndex / 3) &&
                  Math.floor(selected.col / 3) === Math.floor(colIndex / 3));
              const sameValue =
                selectedValue !== 0 && value === selectedValue && !selectedCell;
              const conflict = conflicts.has(key);
              const fixed = puzzle[rowIndex][colIndex] !== 0;

              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  className={[
                    "sudoku-cell",
                    fixed ? "fixed" : "",
                    selectedCell ? "selected" : "",
                    related && !selectedCell ? "related" : "",
                    sameValue ? "same-value" : "",
                    conflict ? "conflict" : "",
                    colIndex % 3 === 2 && colIndex !== 8 ? "box-right" : "",
                    rowIndex % 3 === 2 && rowIndex !== 8 ? "box-bottom" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setSelected({ row: rowIndex, col: colIndex })}
                  aria-selected={selectedCell}
                >
                  {value === 0 ? "" : value}
                </button>
              );
            })
          )}
        </div>

        <p className={`status-banner ${won ? "" : ""}`}>{notes}</p>
        {paused && !won ? (
          <p className="status-banner error">Partie en pause</p>
        ) : null}
      </section>

      <aside className="panel side-panel">
        <div className="stat-block">
          <h3>Temps</h3>
          <div className="stat-value">{formatTime(seconds)}</div>
        </div>

        <div className="stat-row">
          <span>Niveau : {difficulty}</span>
          <span>Cases : {filledCount}/81</span>
        </div>

        <div className="side-section">
          <h3>Difficulté</h3>
          <div className="difficulty-row">
            {DIFFICULTIES.map((item) => (
              <button
                key={item}
                type="button"
                className={`difficulty-btn ${
                  difficulty === item ? "active" : ""
                }`}
                onClick={() => startGame(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="side-section">
          <h3>Actions</h3>
          <div className="actions-row">
            <button
              type="button"
              className="action-btn primary"
              onClick={() => startGame(difficulty)}
            >
              Nouvelle partie
            </button>
            <button
              type="button"
              className="action-btn"
              onClick={() => placeValue(0)}
            >
              Effacer
            </button>
          </div>
        </div>

        <div className="side-section mobile-only">
          <h3>Chiffres</h3>
          <div className="numpad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
              <button
                key={value}
                type="button"
                className="num-btn"
                onClick={() => placeValue(value)}
              >
                {value}
              </button>
            ))}
            <button
              type="button"
              className="num-btn erase"
              onClick={() => placeValue(0)}
            >
              Effacer
            </button>
          </div>
        </div>

        <div className="side-section desktop-only">
          <h3>Commandes</h3>
          <div className="controls-hint">
            <span>← → ↑ ↓ déplacer</span>
            <span>1–9 placer un chiffre</span>
            <span>Suppr / Backspace effacer</span>
            <span>P pause</span>
            <span>Souris pour sélectionner une case</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
