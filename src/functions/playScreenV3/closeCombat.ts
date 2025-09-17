import { Character } from "../../interfaces/sharedInterfaces";
import { getItem } from "./equipmentHandling";

/** A* Pathfinding to target-adjacent cell */
export const findPathToAdjacent = (
  start: { x: number; y: number },
  target: { x: number; y: number },
  obstacles: { x: number; y: number }[],
  gridWidth: number,
  gridHeight: number
): { x: number; y: number }[] => {
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

  // BFS for simplicity (good enough for now)
  const queue: { pos: { x: number; y: number }; path: { x: number; y: number }[] }[] = [
    { pos: start, path: [] },
  ];
  const visited = new Set([`${start.x},${start.y}`]);

  while (queue.length) {
    const { pos, path } = queue.shift()!;
    if (targetAdj.some(a => a.x === pos.x && a.y === pos.y)) {
      return path; // Found path to adjacency
    }

    for (const d of dirs) {
      const next = { x: pos.x + d.x, y: pos.y + d.y };
      const key = `${next.x},${next.y}`;
      if (!inBounds(next) || visited.has(key) || obstacleSet.has(key)) continue;
      visited.add(key);
      queue.push({ pos: next, path: [...path, next] });
    }
  }
  return [];
};

/** Prototype melee attack (unchanged) */
const meleeAttack = (attacker: Character, defender: Character, itemStore: typeof itemStore) => {
  const equippedId = attacker.equipment.rightHand || attacker.equipment.leftHand;
  const weapon = equippedId ? getItem(equippedId, itemStore) : null;

  const baseDamage = weapon?.damage?.piercing || 5;
  const critChance = 0.1;
  const dmg = Math.random() < critChance ? baseDamage * 2 : baseDamage;

  defender.hp -= dmg;
  console.log(`${attacker.name} hits ${defender.name} for ${dmg} dmg`);
};

/** Hook into click */
const handleClick = (e: React.MouseEvent) => {
  if (!selectedId) return;

  const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

  const selectedChar = gameObject.characters.find(c => c.id === selectedId);
  if (!selectedChar) return;

  if (selectedAction === "melee") {
    const target = gameObject.characters.find(c => Math.round(c.location.x) === x && Math.round(c.location.y) === y);

    if (target && target.team !== selectedChar.team) {
      // Get obstacles = rectObstacles + other characters
      const obstacles = [
        ...gameObject.rectObstacles.flatMap(r =>
          Array.from({ length: r.width }, (_, dx) =>
            Array.from({ length: r.height }, (_, dy) => ({ x: r.x + dx, y: r.y + dy }))
          ).flat()
        ),
        ...gameObject.characters
          .filter(c => c.id !== selectedChar.id && c.id !== target.id)
          .map(c => ({ x: Math.round(c.location.x), y: Math.round(c.location.y) })),
      ];

      const path = findPathToAdjacent(
        { x: Math.round(selectedChar.location.x), y: Math.round(selectedChar.location.y) },
        { x: Math.round(target.location.x), y: Math.round(target.location.y) },
        obstacles,
        GRID_WIDTH,
        GRID_HEIGHT
      );

      if (path.length > 0) {
        // Walk the path step by step
        let stepIndex = 0;
        const walkInterval = setInterval(() => {
          if (stepIndex >= path.length) {
            clearInterval(walkInterval);
            // Attack once adjacent
            const dist =
              Math.abs(selectedChar.location.x - target.location.x) +
              Math.abs(selectedChar.location.y - target.location.y);
            if (dist === 1) {
              meleeAttack(selectedChar, target, itemStore);
            }
            return;
          }
          const step = path[stepIndex];
          selectedChar.location = { ...step };
          stepIndex++;
        }, 200); // speed: 200ms per step
      }
    }
  }
};
