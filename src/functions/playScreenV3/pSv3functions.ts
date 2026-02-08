import { AStarFinder, Grid } from "pathfinding";
import { AnyItem, Character, CombatProps, DamageResult, HIT_LOCATIONS, HitPart, Weapon } from "../../interfaces/sharedInterfaces";

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

export const findPathToWithinRange = (
  from: { x: number; y: number },
  target: { x: number; y: number },
  range: number,
  obstacles: { x: number; y: number }[],
  gridWidth: number,
  gridHeight: number
): number[][] => {
  const grid = new Grid(gridWidth, gridHeight);

  // block obstacles
  obstacles.forEach(o => {
    grid.setWalkableAt(o.x, o.y, false);
  });

  const finder = new AStarFinder({ allowDiagonal: true, dontCrossCorners: true });

  let bestPath: number[][] = [];
  let shortest = Infinity;

  // scan tiles within range
  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      const x = target.x + dx;
      const y = target.y + dy;

      if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) continue;
      if (!grid.isWalkableAt(x, y)) continue;

      const dist = Math.hypot(dx, dy);
      if (dist > range) continue;

      const path = finder.findPath(from.x, from.y, x, y, grid.clone());
      if (path.length > 0 && path.length < shortest) {
        shortest = path.length;
        bestPath = path;
      }
    }
  }

  return bestPath;
};

export const resolveDamage = (
  attack: CombatProps,
  target: Character,
  hitPart: "head" | "upperBody" | "legs" | "hands",
  itemStore: Record<string, AnyItem>
): DamageResult => {

  const baseDamage = attack.damage + Math.ceil(Math.random() * 6);

  const armorId = target.equipment[hitPart as keyof Character["equipment"]];

  // === NO ARMOR ===
  if (!armorId || armorId === "empty") {
    return {
      hitPart,
      damage: baseDamage,
      armorHit: false,
      penetrated: true,
    };
  }

  const armor = itemStore[armorId];
  if (!armor || armor.type !== "armour") {
    return {
      hitPart,
      damage: baseDamage,
      armorHit: false,
      penetrated: true,
    };
  }

  // === ARMOR COVERAGE CHECK ===
  const coverageRoll = Math.random() * 100;
  console.log('coverageRoll: ', coverageRoll, ' vs ', armor.coverage);
  if (coverageRoll > armor.coverage) {
    // Missed armor → flesh hit
    return {
      hitPart,
      damage: baseDamage,
      armorHit: false,
      penetrated: true,
    };
  }

  // === ARMOR WAS HIT ===
  const armourPiercing = attack.armourPiercing ?? 0;
  console.log('ap ', armourPiercing, ' vs ', armor.hardness);
  if (armourPiercing > armor.hardness) {
    // Penetrated armor
    return {
      hitPart,
      damage: baseDamage,
      armorHit: true,
      penetrated: true,
    };
  }

  // === ARMOR STOPPED IT ===
  return {
    hitPart,
    damage: 0,
    armorHit: true,
    penetrated: false,
  };
};

export const rollHitLocation = (): HitPart => {
  const roll = Math.random() * 100;
  let acc = 0;

  for (const loc of HIT_LOCATIONS) {
    acc += loc.chance;
    if (roll <= acc) return loc.part;
  }

  return "upperBody"; // fallback
};

