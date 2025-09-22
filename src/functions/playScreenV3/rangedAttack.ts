//import { Character, GameObject } from "../../interfaces/sharedInterfaces";
//import { findPathToAdjacent } from "./closeCombat";

import { GameObject } from "../../interfaces/sharedInterfaces";

/** Collect obstacles as array of coordinates (for LoS checks) */
export const getObstacles = (
  gameObject: GameObject,
  excludeIds: string[] = []
): { x: number; y: number }[] => {
  const obstacles: { x: number; y: number }[] = [];

  // Rectangular obstacles from map
  gameObject.gameMap.rectObstacles.forEach(b => {
    for (let i = 0; i < b.w; i++) {
      for (let j = 0; j < b.h; j++) {
        obstacles.push({ x: b.x + i, y: b.y + j });
      }
    }
  });

  // Characters as obstacles (except the excluded ones, e.g. attacker + target)
  gameObject.characters.forEach(c => {
    if (!excludeIds.includes(c.id)) {
      obstacles.push({
        x: Math.round(c.location.x),
        y: Math.round(c.location.y),
      });
    }
  });

  return obstacles;
};


export function hasLineOfSight(
  start: { x: number; y: number },
  end: { x: number; y: number },
  obstacles: { x: number; y: number }[]
): boolean {
  const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));

  let x0 = start.x, y0 = start.y;
  let x1 = end.x, y1 = end.y;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    if (obstacleSet.has(`${x0},${y0}`)) {
      console.log('los blocked');
      return false;
    } // 👈 blocked
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }

  return true;
}

/*
export function performRangedAttack(
  attacker: Character,
  target: Character,
  setGameObject: React.Dispatch<React.SetStateAction<GameObject>>
) {
  setGameObject(gob => ({
    ...gob,
    hits: [
      ...gob.hits,
      {
        attackerId: attacker.id,
        targetId: target.id,
        type: "ranged",
        damage: 5, // TODO: use weapon stats
      }
    ]
  }));
}
*/
/*
export function issueRangedAttackOrder(
  attacker: Character,
  target: Character,
  obstacles: { x: number; y: number }[],
  setGameObject: React.Dispatch<React.SetStateAction<GameObject>>
) {
  // 1. Check line of sight
  if (hasLineOfSight(attacker.location, target.location, obstacles)) {
    // 👊 immediate ranged attack
    performRangedAttack(attacker, target, setGameObject);
  } else {
    // 2. No LoS → move until LoS possible
    const path = findPathToAdjacent(
      attacker.location,
      target.location,
      obstacles,
      GRID_WIDTH,
      GRID_HEIGHT
    );

    setGameObject(gob => ({
      ...gob,
      characters: gob.characters.map(c =>
        c.id === attacker.id
          ? {
              ...c,
              path,
              targetLocation: target.location,
              action: "moveAndShoot",
              actionTarget: target.id,
            }
          : c
      )
    }));
  }
}

*/