"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Direction,
  GRID_SIZE,
  OPPOSITE,
  Point,
  createInitialSnake,
  directionFromKey,
  hitsSelf,
  hitsWall,
  levelForScore,
  loadRecord,
  nextHead,
  randomFood,
  saveRecord,
  speedForScore,
} from "@/lib/snake";

type Status = "ready" | "playing" | "paused" | "over";

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(() => createInitialSnake());
  const [food, setFood] = useState<Point>({ x: 14, y: 10 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(0);

  const directionRef = useRef<Direction>("RIGHT");
  const queuedDirectionRef = useRef<Direction>("RIGHT");
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const statusRef = useRef(status);
  const scoreRef = useRef(score);

  useEffect(() => {
    setRecord(loadRecord());
    setFood(randomFood(createInitialSnake()));
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const resetGame = useCallback(() => {
    const initial = createInitialSnake();
    setSnake(initial);
    setFood(randomFood(initial));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    queuedDirectionRef.current = "RIGHT";
    setScore(0);
    setStatus("ready");
  }, []);

  const queueDirection = useCallback((next: Direction) => {
    const current = queuedDirectionRef.current;
    if (OPPOSITE[current] === next) return;
    queuedDirectionRef.current = next;
    setDirection(next);
  }, []);

  const tick = useCallback(() => {
    const nextDirection = queuedDirectionRef.current;
    directionRef.current = nextDirection;
    setDirection(nextDirection);

    const currentSnake = snakeRef.current;
    const head = currentSnake[0];
    const newHead = nextHead(head, nextDirection);

    if (hitsWall(newHead) || hitsSelf(newHead, currentSnake)) {
      setStatus("over");
      const finalScore = scoreRef.current;
      setRecord((prev) => {
        if (finalScore > prev) {
          saveRecord(finalScore);
          return finalScore;
        }
        return prev;
      });
      return;
    }

    const ateFood =
      newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
    const grown = [newHead, ...currentSnake];
    const nextSnake = ateFood ? grown : grown.slice(0, -1);

    setSnake(nextSnake);

    if (ateFood) {
      setFood(randomFood(nextSnake));
      setScore((prev) => prev + 10);
    }
  }, []);

  useEffect(() => {
    if (status !== "playing") return;

    const id = window.setInterval(tick, speedForScore(score));
    return () => window.clearInterval(id);
  }, [status, score, tick]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const next = directionFromKey(event.key);

      if (event.key === " " || event.key === "Escape") {
        event.preventDefault();
        setStatus((prev) => {
          if (prev === "playing") return "paused";
          if (prev === "paused" || prev === "ready") return "playing";
          return prev;
        });
        return;
      }

      if (!next) return;
      event.preventDefault();

      if (statusRef.current === "ready" || statusRef.current === "paused") {
        setStatus("playing");
      }

      if (statusRef.current === "over") return;
      queueDirection(next);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [queueDirection]);

  const cellStyle = (point: Point) => ({
    left: `${(point.x / GRID_SIZE) * 100}%`,
    top: `${(point.y / GRID_SIZE) * 100}%`,
    width: `${100 / GRID_SIZE}%`,
    height: `${100 / GRID_SIZE}%`,
  });

  const startOrResume = () => {
    if (status === "over") {
      resetGame();
      setStatus("playing");
      return;
    }
    setStatus("playing");
  };

  const level = levelForScore(score);

  return (
    <div className="play-layout">
      <div className="board-wrap">
        <div className="board-canvas" aria-label="Plateau Snake">
          {snake.map((segment, index) => (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`cell snake${index === 0 ? " head" : ""}`}
              style={cellStyle(segment)}
            />
          ))}
          <div className="cell food" style={cellStyle(food)} />

          {status === "ready" && (
            <div className="overlay">
              <h2>Snake</h2>
              <p>Appuie sur une flèche, ZQSD/WASD ou Jouer pour commencer</p>
              <button className="btn primary" onClick={startOrResume}>
                Jouer
              </button>
            </div>
          )}

          {status === "paused" && (
            <div className="overlay">
              <h2>Pause</h2>
              <p>Espace ou Reprendre pour continuer</p>
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
          <button className="btn danger" onClick={resetGame}>
            Reset
          </button>
        </div>

        <div className="touch-pad" aria-label="Commandes tactiles">
          <button
            className="touch-btn up"
            onClick={() => {
              if (status !== "playing") setStatus("playing");
              queueDirection("UP");
            }}
            aria-label="Haut"
          >
            ↑
          </button>
          <button
            className="touch-btn left"
            onClick={() => {
              if (status !== "playing") setStatus("playing");
              queueDirection("LEFT");
            }}
            aria-label="Gauche"
          >
            ←
          </button>
          <button
            className="touch-btn down"
            onClick={() => {
              if (status !== "playing") setStatus("playing");
              queueDirection("DOWN");
            }}
            aria-label="Bas"
          >
            ↓
          </button>
          <button
            className="touch-btn right"
            onClick={() => {
              if (status !== "playing") setStatus("playing");
              queueDirection("RIGHT");
            }}
            aria-label="Droite"
          >
            →
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
            <div className="stat-label">Record</div>
            <div className="stat-value" style={{ fontSize: "1.4rem" }}>
              {record.toLocaleString("fr-FR")}
            </div>
          </div>
        </div>

        <div className="desktop-only">
          <div className="stat-label">Commandes</div>
          <div className="controls-list">
            <div>
              <strong>← → ↑ ↓</strong> déplacer
            </div>
            <div>
              <strong>ZQSD / WASD</strong> déplacer
            </div>
            <div>
              <strong>Espace</strong> pause
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
