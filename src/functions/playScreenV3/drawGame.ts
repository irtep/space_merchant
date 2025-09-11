import { itemStore } from "../../data/itemStore";
import { Character, Loot } from "../../interfaces/sharedInterfaces";
import { getItem } from "./equipmentHandling";

interface Projectile {
  x: number;
  y: number;
  dx: number;
  dy: number;
  active: boolean;
  trail: { x: number; y: number; alpha: number }[];
  type: "laser" | "energy" | "bullet";
}

const CELL_SIZE = 20;

export function drawGame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  gameObject: any,
  selectedId: string | null,
  projectiles: Projectile[],
  hoverPos: { x: number; y: number } | null,
  selectedAction: "move" | "ranged" | "melee" | null
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#ccc";

  // borders
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas.width, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvas.width, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.stroke();

  // buildings
  ctx.fillStyle = "gray";
  gameObject.gameMap.rectObstacles.forEach((b: any) => {
    ctx.fillRect(b.x * CELL_SIZE, b.y * CELL_SIZE, b.w * CELL_SIZE, b.h * CELL_SIZE);
  });

  // loots
  gameObject.gameMap.loots.forEach((loot: Loot) => {
    const item = getItem(loot.itemId, itemStore);
    if (!item) return;
    ctx.fillStyle = "gold";
    ctx.fillRect(loot.location.x * CELL_SIZE, loot.location.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = "black";
    ctx.fillText('some items', loot.location.x * CELL_SIZE + CELL_SIZE / 2, loot.location.y * CELL_SIZE + CELL_SIZE / 2);
  });

  // characters
  gameObject.characters.forEach((c: Character) => {
    ctx.beginPath();
    ctx.arc(
      c.location.x * CELL_SIZE + CELL_SIZE / 2,
      c.location.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "green";
    ctx.fill();
    if (c.id === selectedId) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "yellow";
      ctx.stroke();
    }
    ctx.font = '14px Arial';
    ctx.fillStyle = 'cyan';
    ctx.fillText(c.name, c.location.x * CELL_SIZE + CELL_SIZE / 2, c.location.y * CELL_SIZE + CELL_SIZE / 2);
  });

  // projectiles
  projectiles.forEach(p => {
    switch (p.type) {
      case "laser":
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.dx * 10, p.y + p.dy * 10);
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
      case "energy":
        for (let i = 0; i < p.trail.length; i++) {
          const t = p.trail[i];
          ctx.beginPath();
          ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,165,0,${(i + 1) / p.trail.length})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
        break;
      case "bullet":
        ctx.fillStyle = "black";
        ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
        break;
    }
  });

  // hover previews
  if (hoverPos && selectedAction) {
    const cx = hoverPos.x * CELL_SIZE + CELL_SIZE / 2;
    const cy = hoverPos.y * CELL_SIZE + CELL_SIZE / 2;
    let size = 8;

    if (selectedAction === "move") {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(cx, cy - 6, 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy - 2);
      ctx.lineTo(cx, cy + 6);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 5, cy + 0);
      ctx.lineTo(cx + 5, cy + 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy + 6);
      ctx.lineTo(cx - 4, cy + 12);
      ctx.moveTo(cx, cy + 6);
      ctx.lineTo(cx + 4, cy + 12);
      ctx.stroke();
    }

    if (selectedAction === "ranged") {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(cx - size, cy);
      ctx.lineTo(cx + size, cy);
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx, cy + size);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (selectedAction === "melee") {
      ctx.strokeStyle = "darkgreen";
      ctx.lineWidth = 3;
      size = 10;

      ctx.beginPath();
      ctx.moveTo(cx - size, cy - size);
      ctx.lineTo(cx + size, cy + size);
      ctx.moveTo(cx + size, cy - size);
      ctx.lineTo(cx - size, cy + size);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, size * 1.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
