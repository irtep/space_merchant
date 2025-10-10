import { Character } from "../../interfaces/sharedInterfaces";

export const isCellFree = (
  x: number,
  y: number,
  obstacles: { x: number; y: number; w: number; h: number }[],
  taken: { x: number; y: number }[]
) => {
  // Check against obstacles
  for (const b of obstacles) {
    if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
      return false;
    }
  }

  // Check against already placed characters
  for (const t of taken) {
    if (t.x === x && t.y === y) {
      return false;
    }
  }

  return true;
};

export const placeCharactersRandomly = (
  characters: Character[],
  obstacles: { x: number; y: number; w: number; h: number }[],
  gridWidth: number,
  gridHeight: number
) => {
  const placed: { x: number; y: number }[] = [];

  return characters.map(c => {
    let x: number, y: number;
    let attempts = 0;

    do {
      x = Math.floor(Math.random() * gridWidth);
      y = Math.floor(Math.random() * gridHeight);
      attempts++;
      if (attempts > 1000) {
        console.warn("Could not find free spot for character:", c.id);
        break;
      }
    } while (!isCellFree(x, y, obstacles, placed));

    placed.push({ x, y });

    return {
      ...c,
      location: { x, y },
    };
  });
};

export function getDistance(obj1: { x: number; y: number }, obj2: { x: number; y: number }): number {
  const dx = obj2.x - obj1.x;
  const dy = obj2.y - obj1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

