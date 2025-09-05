import React, { useState, useRef, useEffect } from "react";
import { Grid, AStarFinder } from "pathfinding";

interface Character {
  id: number;
  x: number;
  y: number;
  destX: number;
  destY: number;
  color: string;
  path: [number, number][];
}

interface Projectile {
  x: number;
  y: number;
  dx: number;
  dy: number;
  active: boolean;
  trail: { x: number; y: number; alpha: number }[];
}

const CELL_SIZE = 20;
const GRID_WIDTH = 30;
const GRID_HEIGHT = 20;

const BUILDINGS = [
  { x: 5, y: 5, w: 4, h: 4 },
  { x: 15, y: 10, w: 5, h: 3 },
  { x: 22, y: 4, w: 3, h: 6 },
];

const PlayScreenV2: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([
    { id: 1, x: 2, y: 2, destX: 2, destY: 2, color: "red", path: [] },
    { id: 2, x: 10, y: 2, destX: 10, destY: 2, color: "blue", path: [] },
    { id: 3, x: 2, y: 10, destX: 2, destY: 10, color: "green", path: [] },
  ]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [opponent, setOpponent] = useState<{ x: number; y: number }>({ x: 20, y: 15 });
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const buildGrid = () => {
    const grid = new Grid(GRID_WIDTH, GRID_HEIGHT);
    BUILDINGS.forEach(b => {
      for (let i = 0; i < b.w; i++) {
        for (let j = 0; j < b.h; j++) {
          grid.setWalkableAt(b.x + i, b.y + j, false);
        }
      }
    });
    return grid;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!selectedId) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

    const grid = buildGrid();
    const finder = new AStarFinder();

    setCharacters(chars =>
      chars.map(c => {
        if (c.id === selectedId) {
          const path = finder.findPath(Math.round(c.x), Math.round(c.y), x, y, grid.clone());
          return { ...c, destX: x, destY: y, path };
        }
        return c;
      })
    );
  };

  const shoot = () => {
    if (!selectedId) return;
    const shooter = characters.find(c => c.id === selectedId);
    if (!shooter) return;

    const startX = shooter.x * CELL_SIZE + CELL_SIZE / 2;
    const startY = shooter.y * CELL_SIZE + CELL_SIZE / 2;
    const targetX = opponent.x * CELL_SIZE + CELL_SIZE / 2;
    const targetY = opponent.y * CELL_SIZE + CELL_SIZE / 2;

    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(dist / 5);

    for (let i = 1; i <= steps; i++) {
      const cx = startX + (dx * i) / steps;
      const cy = startY + (dy * i) / steps;

      for (const b of BUILDINGS) {
        if (
          cx >= b.x * CELL_SIZE &&
          cx <= (b.x + b.w) * CELL_SIZE &&
          cy >= b.y * CELL_SIZE &&
          cy <= (b.y + b.h) * CELL_SIZE
        ) {
          return; // blocked by building
        }
      }

      for (const c of characters) {
        const ccx = c.x * CELL_SIZE + CELL_SIZE / 2;
        const ccy = c.y * CELL_SIZE + CELL_SIZE / 2;
        if (Math.hypot(cx - ccx, cy - ccy) < CELL_SIZE / 2) {
          return; // blocked by teammate
        }
      }
    }

    setProjectiles(prev => [
      ...prev,
      {
        x: startX,
        y: startY,
        dx: dx / dist,
        dy: dy / dist,
        active: true,
        trail: [],
      },
    ]);
  };

  useEffect(() => {
    let animationFrame: number;

    const step = () => {
      setCharacters(chars =>
        chars.map(c => {
          if (c.path.length > 0) {
            const [nextX, nextY] = c.path[0];
            const targetX = nextX * CELL_SIZE + CELL_SIZE / 2;
            const targetY = nextY * CELL_SIZE + CELL_SIZE / 2;

            const currentX = c.x * CELL_SIZE + CELL_SIZE / 2;
            const currentY = c.y * CELL_SIZE + CELL_SIZE / 2;

            const dx = targetX - currentX;
            const dy = targetY - currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const speed = 2;

            if (dist < speed) {
              return { ...c, x: nextX, y: nextY, path: c.path.slice(1) };
            } else {
              const moveX = currentX + (dx / dist) * speed;
              const moveY = currentY + (dy / dist) * speed;
              return {
                ...c,
                x: moveX / CELL_SIZE - 0.5,
                y: moveY / CELL_SIZE - 0.5,
              };
            }
          }
          return c;
        })
      );

      setProjectiles(prev =>
        prev
          .map(p => {
            if (!p.active) return p;
            const speed = 2; // slower projectile
            const nx = p.x + p.dx * speed;
            const ny = p.y + p.dy * speed;

            const newTrail = [...p.trail, { x: nx, y: ny, alpha: 1 }].slice(-15);

            const ox = opponent.x * CELL_SIZE + CELL_SIZE / 2;
            const oy = opponent.y * CELL_SIZE + CELL_SIZE / 2;
            if (Math.hypot(nx - ox, ny - oy) < CELL_SIZE / 2) {
              return { ...p, active: false };
            }

            for (const b of BUILDINGS) {
              if (nx >= b.x * CELL_SIZE && nx <= (b.x + b.w) * CELL_SIZE && ny >= b.y * CELL_SIZE && ny <= (b.y + b.h) * CELL_SIZE) {
                return { ...p, active: false };
              }
            }

            return { ...p, x: nx, y: ny, trail: newTrail };
          })
          .filter(p => p.active)
      );

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [opponent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#ccc";
    for (let i = 0; i <= GRID_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    for (let j = 0; j <= GRID_HEIGHT; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * CELL_SIZE);
      ctx.lineTo(GRID_WIDTH * CELL_SIZE, j * CELL_SIZE);
      ctx.stroke();
    }

    ctx.fillStyle = "gray";
    BUILDINGS.forEach(b => {
      ctx.fillRect(b.x * CELL_SIZE, b.y * CELL_SIZE, b.w * CELL_SIZE, b.h * CELL_SIZE);
    });

    characters.forEach(c => {
      ctx.beginPath();
      ctx.arc(
        c.x * CELL_SIZE + CELL_SIZE / 2,
        c.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = c.color;
      ctx.fill();
      if (c.id === selectedId) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "yellow";
        ctx.stroke();
      }
    });

    ctx.beginPath();
    ctx.arc(
      opponent.x * CELL_SIZE + CELL_SIZE / 2,
      opponent.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "black";
    ctx.fill();

    projectiles.forEach(p => {
      // Draw trail
      for (let i = 0; i < p.trail.length; i++) {
        const t = p.trail[i];
        ctx.beginPath();
        ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,165,0,${(i + 1) / p.trail.length})`;
        ctx.fill();
      }

      // Draw main projectile
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "orange";
      ctx.fill();
    });
  }, [characters, selectedId, opponent, projectiles]);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="p-4 text-xl font-bold text-center bg-gray-200">Header</header>
      <div className="flex flex-1">
        <div className="w-3/5 flex justify-center items-center bg-green-50">
          <canvas
            ref={canvasRef}
            width={GRID_WIDTH * CELL_SIZE}
            height={GRID_HEIGHT * CELL_SIZE}
            onClick={handleClick}
            className="border border-gray-400"
          />
        </div>

        <div className="w-2/5 p-4 bg-blue-50 flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Controls</h2>
          {characters.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`p-2 rounded border ${
                selectedId === c.id ? "bg-yellow-300" : "bg-white"
              }`}
            >
              Select Character {c.id}
            </button>
          ))}

          {selectedId && (
            <button
              onClick={shoot}
              className="p-2 mt-4 bg-red-300 rounded border"
            >
              Shoot Opponent
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayScreenV2;
