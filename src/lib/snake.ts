export type Point = { x: number; y: number };
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export const GRID_SIZE = 20;
export const INITIAL_SPEED_MS = 140;
export const MIN_SPEED_MS = 70;
export const RECORD_KEY = "triplay-snake-record";

export const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

export function createInitialSnake(): Point[] {
  return [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
}

export function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  let point: Point;

  do {
    point = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (occupied.has(`${point.x},${point.y}`));

  return point;
}

export function nextHead(head: Point, direction: Direction): Point {
  switch (direction) {
    case "UP":
      return { x: head.x, y: head.y - 1 };
    case "DOWN":
      return { x: head.x, y: head.y + 1 };
    case "LEFT":
      return { x: head.x - 1, y: head.y };
    case "RIGHT":
      return { x: head.x + 1, y: head.y };
  }
}

export function hitsWall(point: Point): boolean {
  return (
    point.x < 0 ||
    point.y < 0 ||
    point.x >= GRID_SIZE ||
    point.y >= GRID_SIZE
  );
}

export function hitsSelf(point: Point, snake: Point[]): boolean {
  return snake.some((segment) => segment.x === point.x && segment.y === point.y);
}

export function speedForScore(score: number): number {
  return Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - Math.floor(score / 50) * 8);
}

export function levelForScore(score: number): number {
  return Math.floor(score / 100) + 1;
}

export function directionFromKey(key: string): Direction | null {
  const normalized = key.toLowerCase();

  if (key === "ArrowUp" || normalized === "z" || normalized === "w") return "UP";
  if (key === "ArrowDown" || normalized === "s") return "DOWN";
  if (key === "ArrowLeft" || normalized === "q" || normalized === "a") return "LEFT";
  if (key === "ArrowRight" || normalized === "d") return "RIGHT";

  return null;
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
