"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivePiece,
  Board,
  COLS,
  PIECE_COLORS,
  PieceId,
  ROWS,
  cellsOf,
  clearLines,
  createBag,
  createEmptyBoard,
  hardDropY,
  levelForLines,
  loadRecord,
  lockPiece,
  saveRecord,
  scoreForLines,
  spawnPiece,
  speedForLevel,
  tryMove,
  tryRotate,
} from "@/lib/tetrix";

type Status = "ready" | "playing" | "paused" | "over";

function takeNext(
  bag: PieceId[],
  setBag: (next: PieceId[]) => void
): { piece: ActivePiece; nextId: PieceId } {
  let pool = [...bag];
  if (pool.length < 2) {
    pool = [...pool, ...createBag()];
  }
  const [current, upcoming, ...rest] = pool;
  setBag([upcoming, ...rest]);
  return { piece: spawnPiece(current), nextId: upcoming };
}

export default function TetrixGame() {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [piece, setPiece] = useState<ActivePiece | null>(null);
  const [nextId, setNextId] = useState<PieceId>("T");
  const [bag, setBag] = useState<PieceId[]>(() => createBag());
  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [record, setRecord] = useState(0);

  const boardRef = useRef(board);
  const pieceRef = useRef(piece);
  const bagRef = useRef(bag);
  const statusRef = useRef(status);
  const scoreRef = useRef(score);
  const linesRef = useRef(lines);

  useEffect(() => {
    setRecord(loadRecord());
  }, []);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    pieceRef.current = piece;
  }, [piece]);

  useEffect(() => {
    bagRef.current = bag;
  }, [bag]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const syncBag = useCallback((next: PieceId[]) => {
    bagRef.current = next;
    setBag(next);
  }, []);

  const spawnFromBag = useCallback(() => {
    const result = takeNext(bagRef.current, syncBag);
    setNextId(result.nextId);
    if (collidesSpawn(boardRef.current, result.piece)) {
      setPiece(result.piece);
      setStatus("over");
      const finalScore = scoreRef.current;
      setRecord((prev) => {
        if (finalScore > prev) {
          saveRecord(finalScore);
          return finalScore;
        }
        return prev;
      });
      return null;
    }
    setPiece(result.piece);
    pieceRef.current = result.piece;
    return result.piece;
  }, [syncBag]);

  const resetGame = useCallback(() => {
    const freshBag = createBag();
    bagRef.current = freshBag;
    setBag(freshBag);
    setBoard(createEmptyBoard());
    boardRef.current = createEmptyBoard();
    setScore(0);
    setLines(0);
    setStatus("ready");
    const result = takeNext(freshBag, syncBag);
    setNextId(result.nextId);
    setPiece(result.piece);
    pieceRef.current = result.piece;
  }, [syncBag]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const ensurePlaying = useCallback(() => {
    if (statusRef.current === "ready" || statusRef.current === "paused") {
      statusRef.current = "playing";
      setStatus("playing");
    }
  }, []);

  const lockAndContinue = useCallback(
    (current: ActivePiece) => {
      const locked = lockPiece(boardRef.current, current);
      const { board: clearedBoard, cleared } = clearLines(locked);
      boardRef.current = clearedBoard;
      setBoard(clearedBoard);

      if (cleared > 0) {
        const level = levelForLines(linesRef.current);
        setLines((prev) => prev + cleared);
        setScore((prev) => prev + scoreForLines(cleared, level));
      }

      spawnFromBag();
    },
    [spawnFromBag]
  );

  const stepDown = useCallback(
    (awardSoftDrop: boolean) => {
      const current = pieceRef.current;
      if (!current || statusRef.current !== "playing") return;
      const moved = tryMove(boardRef.current, current, 0, 1);
      if (moved) {
        setPiece(moved);
        if (awardSoftDrop) setScore((prev) => prev + 1);
        return;
      }
      lockAndContinue(current);
    },
    [lockAndContinue]
  );

  const hardDrop = useCallback(() => {
    const current = pieceRef.current;
    if (!current || statusRef.current !== "playing") return;
    const dropY = hardDropY(boardRef.current, current);
    const dropped = { ...current, y: dropY };
    const distance = dropY - current.y;
    setScore((prev) => prev + distance * 2);
    setPiece(dropped);
    pieceRef.current = dropped;
    lockAndContinue(dropped);
  }, [lockAndContinue]);

  const moveHorizontal = useCallback(
    (dx: number) => {
      const current = pieceRef.current;
      if (!current || statusRef.current === "over") return;
      ensurePlaying();
      if (statusRef.current !== "playing") return;
      const moved = tryMove(boardRef.current, current, dx, 0);
      if (moved) setPiece(moved);
    },
    [ensurePlaying]
  );

  const rotate = useCallback(() => {
    const current = pieceRef.current;
    if (!current || statusRef.current === "over") return;
    ensurePlaying();
    if (statusRef.current !== "playing") return;
    const rotated = tryRotate(boardRef.current, current, 1);
    if (rotated) setPiece(rotated);
  }, [ensurePlaying]);

  useEffect(() => {
    if (status !== "playing") return;
    const level = levelForLines(lines);
    const id = window.setInterval(() => stepDown(false), speedForLevel(level));
    return () => window.clearInterval(id);
  }, [status, lines, stepDown]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (event.key === "Escape") {
        event.preventDefault();
        setStatus((prev) => {
          if (prev === "playing") return "paused";
          if (prev === "paused" || prev === "ready") return "playing";
          return prev;
        });
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        if (statusRef.current === "ready" || statusRef.current === "paused") {
          setStatus("playing");
          statusRef.current = "playing";
          return;
        }
        if (statusRef.current === "playing") hardDrop();
        return;
      }

      if (statusRef.current === "over") return;

      if (event.key === "ArrowLeft" || key === "q" || key === "a") {
        event.preventDefault();
        moveHorizontal(-1);
        return;
      }

      if (event.key === "ArrowRight" || key === "d") {
        event.preventDefault();
        moveHorizontal(1);
        return;
      }

      if (event.key === "ArrowDown" || key === "s") {
        event.preventDefault();
        ensurePlaying();
        stepDown(true);
        return;
      }

      if (
        event.key === "ArrowUp" ||
        key === "z" ||
        key === "w" ||
        key === "x"
      ) {
        event.preventDefault();
        rotate();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [ensurePlaying, hardDrop, moveHorizontal, rotate, stepDown]);

  const startOrResume = () => {
    if (status === "over") {
      resetGame();
      setStatus("playing");
      return;
    }
    setStatus("playing");
  };

  const level = levelForLines(lines);
  const ghostY = piece ? hardDropY(board, piece) : 0;
  const ghostCells = piece
    ? cellsOf({ ...piece, y: ghostY }).filter((cell) => cell.y >= 0)
    : [];
  const activeCells = piece
    ? cellsOf(piece).filter((cell) => cell.y >= 0)
    : [];

  const cellStyle = (x: number, y: number) => ({
    left: `${(x / COLS) * 100}%`,
    top: `${(y / ROWS) * 100}%`,
    width: `${100 / COLS}%`,
    height: `${100 / ROWS}%`,
  });

  return (
    <div className="play-layout">
      <div className="board-wrap">
        <div className="board-canvas tetrix-board" aria-label="Plateau Tetrix">
          {board.map((row, y) =>
            row.map((color, x) =>
              color ? (
                <div
                  key={`locked-${x}-${y}`}
                  className="cell tetrix"
                  style={{ ...cellStyle(x, y), background: color }}
                />
              ) : null
            )
          )}

          {ghostCells.map((cell) => (
            <div
              key={`ghost-${cell.x}-${cell.y}`}
              className="cell tetrix ghost"
              style={{
                ...cellStyle(cell.x, cell.y),
                background: piece ? PIECE_COLORS[piece.id] : undefined,
              }}
            />
          ))}

          {activeCells.map((cell) => (
            <div
              key={`active-${cell.x}-${cell.y}`}
              className="cell tetrix"
              style={{
                ...cellStyle(cell.x, cell.y),
                background: piece ? PIECE_COLORS[piece.id] : undefined,
              }}
            />
          ))}

          {status === "ready" && (
            <div className="overlay">
              <h2>Tetrix</h2>
              <p>Flèches / ZQSD pour jouer, Espace pour drop</p>
              <button className="btn primary" onClick={startOrResume}>
                Jouer
              </button>
            </div>
          )}

          {status === "paused" && (
            <div className="overlay">
              <h2>Pause</h2>
              <p>Échap ou Reprendre pour continuer</p>
              <button className="btn primary" onClick={startOrResume}>
                Reprendre
              </button>
            </div>
          )}

          {status === "over" && (
            <div className="overlay">
              <h2>Partie terminée</h2>
              <p>Score : {score}</p>
              <button className="btn primary" onClick={startOrResume}>
                Rejouer
              </button>
            </div>
          )}
        </div>

        <div className="action-bar">
          {status === "playing" ? (
            <button className="btn primary" onClick={() => setStatus("paused")}>
              Pause
            </button>
          ) : (
            <button className="btn primary" onClick={startOrResume}>
              {status === "over" ? "Rejouer" : "Jouer"}
            </button>
          )}
          <button className="btn" onClick={hardDrop} disabled={status !== "playing"}>
            Drop
          </button>
          <button className="btn danger" onClick={resetGame}>
            Reset
          </button>
        </div>

        <div className="touch-pad tetrix-pad" aria-label="Commandes tactiles">
          <button
            className="touch-btn up"
            onClick={rotate}
            aria-label="Tourner"
          >
            ↻
          </button>
          <button
            className="touch-btn left"
            onClick={() => moveHorizontal(-1)}
            aria-label="Gauche"
          >
            ←
          </button>
          <button
            className="touch-btn down"
            onClick={() => {
              ensurePlaying();
              stepDown(true);
            }}
            aria-label="Bas"
          >
            ↓
          </button>
          <button
            className="touch-btn right"
            onClick={() => moveHorizontal(1)}
            aria-label="Droite"
          >
            →
          </button>
          <button
            className="touch-btn drop"
            onClick={() => {
              ensurePlaying();
              hardDrop();
            }}
            aria-label="Chute rapide"
          >
            ⇓
          </button>
        </div>
      </div>

      <aside className="side-panel">
        <div>
          <div className="stat-label">Score</div>
          <div className="stat-value">{score.toLocaleString("fr-FR")}</div>
        </div>

        <div className="stat-row">
          <div>
            <div className="stat-label">Niveau</div>
            <div className="stat-value" style={{ fontSize: "1.4rem" }}>
              {level}
            </div>
          </div>
          <div>
            <div className="stat-label">Lignes</div>
            <div className="stat-value" style={{ fontSize: "1.4rem" }}>
              {lines}
            </div>
          </div>
        </div>

        <div>
          <div className="stat-label">Record</div>
          <div className="stat-value" style={{ fontSize: "1.4rem" }}>
            {record.toLocaleString("fr-FR")}
          </div>
        </div>

        <div>
          <div className="stat-label">Suivante</div>
          <div className="next-piece" aria-label={`Pièce suivante ${nextId}`}>
            {previewCells(nextId).map((cell) => (
              <div
                key={`next-${cell.x}-${cell.y}`}
                className="next-cell"
                style={{
                  gridColumn: cell.x + 1,
                  gridRow: cell.y + 1,
                  background: PIECE_COLORS[nextId],
                }}
              />
            ))}
          </div>
        </div>

        <div className="desktop-only">
          <div className="stat-label">Commandes</div>
          <div className="controls-list">
            <div>
              <strong>← →</strong> déplacer
            </div>
            <div>
              <strong>↑ / Z / W</strong> tourner
            </div>
            <div>
              <strong>↓</strong> descente douce
            </div>
            <div>
              <strong>Espace</strong> drop
            </div>
            <div>
              <strong>Échap</strong> pause
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function collidesSpawn(board: Board, piece: ActivePiece): boolean {
  return cellsOf(piece).some((cell) => {
    if (cell.y < 0) return false;
    if (cell.x < 0 || cell.x >= COLS || cell.y >= ROWS) return true;
    return board[cell.y][cell.x] !== null;
  });
}

function previewCells(id: PieceId) {
  const shapes: Record<PieceId, { x: number; y: number }[]> = {
    I: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    O: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    T: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    S: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    Z: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    J: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    L: [
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
  };
  return shapes[id];
}
