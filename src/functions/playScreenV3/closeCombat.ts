import { Character/*, ItemStore*/ } from "../../interfaces/sharedInterfaces";
//import { getItem } from "./equipmentHandling";

/** A* Pathfinding to target-adjacent cell */
export const findPathToAdjacent = (
  start: { x: number; y: number },
  target: { x: number; y: number },
  obstacles: { x: number; y: number }[],
  gridWidth: number,
  gridHeight: number
): number[][] => {
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));
  const targetAdj = dirs.map(d => ({
    x: target.x + d.x,
    y: target.y + d.y,
  }));

  const inBounds = (p: { x: number; y: number }) =>
    p.x >= 0 && p.y >= 0 && p.x < gridWidth && p.y < gridHeight;

  const queue: { pos: { x: number; y: number }; path: number[][] }[] = [
    { pos: start, path: [] },
  ];
  const visited = new Set([`${start.x},${start.y}`]);

  while (queue.length) {
    const { pos, path } = queue.shift()!;
    if (targetAdj.some(a => a.x === pos.x && a.y === pos.y)) {
      return path;
    }

    for (const d of dirs) {
      const next = { x: pos.x + d.x, y: pos.y + d.y };
      const key = `${next.x},${next.y}`;
      if (!inBounds(next) || visited.has(key) || obstacleSet.has(key)) continue;
      visited.add(key);
      queue.push({ pos: next, path: [...path, [next.x, next.y]] }); // 👈 push [x, y] not {x,y}
    }
  }
  return [];
};


/** Prototype melee attack (unchanged) */
export const meleeAttack = (attacker: Character, defender: Character/*, itemStore: ItemStore*/) => {
  //const equippedId = attacker.equipment.rightHand || attacker.equipment.leftHand;
  //const weapon = equippedId ? getItem(equippedId, itemStore) : null;
  console.log('melee attack called');

  const baseDamage = 5;
  const critChance = 0.1;
  const dmg = Math.random() < critChance ? baseDamage * 2 : baseDamage;

  defender.hitPoints -= dmg;
  console.log(`${attacker.name} hits ${defender.name} for ${dmg} dmg`);
};

