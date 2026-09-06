export type Point = { x: number; y: number };
export type Cell = string | null;
export type Board = Cell[][];
export type PieceId = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export type ActivePiece = {
  id: PieceId;
  rotation: number;
  x: number;
  y: number;
};

export const COLS = 10;
export const ROWS = 20;
export const LINES_PER_LEVEL = 10;
export const INITIAL_SPEED_MS = 800;
export const MIN_SPEED_MS = 100;
export const RECORD_KEY = "triplay-tetrix-record";

export const PIECE_COLORS: Record<PieceId, string> = {
  I: "#22d3ee",
  O: "#fbbf24",
  T: "#a78bfa",
  S: "#34d399",
  Z: "#f87171",
  J: "#60a5fa",
  L: "#fb923c",
};

/** Shapes are lists of cells for each rotation (0–3), relative to a 4x4 box. */
const SHAPES: Record<PieceId, Point[][]> = {
  I: [
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
  ],
  O: [
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
  ],
  T: [
    [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
  ],
  S: [
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
    [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
  ],
  Z: [
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
    ],
  ],
  J: [
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
  ],
  L: [
    [
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
  ],
};

const BAG: PieceId[] = ["I", "O", "T", "S", "Z", "J", "L"];

const KICKS: Point[] = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -2, y: 0 },
  { x: 2, y: 0 },
  { x: 0, y: -1 },
];

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null)
  );
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function createBag(): PieceId[] {
  return shuffle(BAG);
}

export function spawnPiece(id: PieceId): ActivePiece {
  return {
    id,
    rotation: 0,
    x: 3,
    y: id === "I" ? -1 : 0,
  };
}

export function cellsOf(piece: ActivePiece): Point[] {
  return SHAPES[piece.id][piece.rotation].map((cell) => ({
    x: piece.x + cell.x,
    y: piece.y + cell.y,
  }));
}

export function collides(board: Board, piece: ActivePiece): boolean {
  return cellsOf(piece).some((cell) => {
    if (cell.x < 0 || cell.x >= COLS || cell.y >= ROWS) return true;
    if (cell.y < 0) return false;
    return board[cell.y][cell.x] !== null;
  });
}

export function tryMove(
  board: Board,
  piece: ActivePiece,
  dx: number,
  dy: number
): ActivePiece | null {
  const next = { ...piece, x: piece.x + dx, y: piece.y + dy };
  return collides(board, next) ? null : next;
}

export function tryRotate(
  board: Board,
  piece: ActivePiece,
  direction: 1 | -1 = 1
): ActivePiece | null {
  const rotation = (piece.rotation + direction + 4) % 4;
  for (const kick of KICKS) {
    const next = {
      ...piece,
      rotation,
      x: piece.x + kick.x,
      y: piece.y + kick.y,
    };
    if (!collides(board, next)) return next;
  }
  return null;
}

export function hardDropY(board: Board, piece: ActivePiece): number {
  let y = piece.y;
  while (!collides(board, { ...piece, y: y + 1 })) {
    y += 1;
  }
  return y;
}

export function lockPiece(board: Board, piece: ActivePiece): Board {
  const next = board.map((row) => [...row]);
  const color = PIECE_COLORS[piece.id];
  for (const cell of cellsOf(piece)) {
    if (cell.y < 0 || cell.y >= ROWS || cell.x < 0 || cell.x >= COLS) continue;
    next[cell.y][cell.x] = color;
  }
  return next;
}

export function clearLines(board: Board): { board: Board; cleared: number } {
  const kept = board.filter((row) => row.some((cell) => cell === null));
  const cleared = ROWS - kept.length;
  const empty = Array.from({ length: cleared }, () =>
    Array.from({ length: COLS }, () => null)
  );
  return { board: [...empty, ...kept], cleared };
}

export function scoreForLines(cleared: number, level: number): number {
  const base = [0, 100, 300, 500, 800][cleared] ?? 0;
  return base * level;
}

export function levelForLines(totalLines: number): number {
  return Math.floor(totalLines / LINES_PER_LEVEL) + 1;
}

export function speedForLevel(level: number): number {
  return Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - (level - 1) * 70);
}

export function loadRecord(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(RECORD_KEY);
  const value = raw ? Number(raw) : 0;
  return Number.isFinite(value) ? value : 0;
}

export function saveRecord(score: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RECORD_KEY, String(score));
}
