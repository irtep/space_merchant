import { GameMap, Item, Weapon } from "../interfaces/sharedInterfaces";
import { items } from "./items";
import { weapons } from "./weapons";

export const jyvaskylaTown: GameMap = {
    rectObstacles: [
        { x: 22, y: 15, w: 21, h: 24, color: 'black', door: { x: 30, y: 15 }, name: 'The Sturdy Oak Tavern' },
        { x: 7, y: 30, w: 19, h: 23, color: 'black', door: { x: 14, y: 30 }, name: 'Blacksmith’s Forge' },
        { x: 50, y: 80, w: 26, h: 30, color: 'black', door: { x: 65, y: 8 }, name: 'The Great Hall of Jyvaskyla' },
        { x: 3, y: 50, w: 30, h: 15, color: 'black', door: { x: 4, y: 50 }, name: 'Harbor Warehouse' },
        { x: 38, y: 48, w: 22, h: 18, color: 'black', door: { x: 45, y: 48 }, name: 'Market Hall' }
    ],
    circleObstacles: [
        { x: 600, y: 360, size: 90, color: 'black', name: 'Stone Watchtower' }
    ],
    loots: [
        { x: 50, y: 50, what: weapons.find((w: Weapon) => w.name === 'an iron dagger') ?? weapons[0] },
        { x: 750, y: 550, what: weapons.find((w: Weapon) => w.name === 'a rusted shortsword') ?? weapons[0] },
        { x: 59, y: 55, what: items.find((i: Item) => i.name === 'gold coin') ?? items[0] },
        { x: 59, y: 55, what: items.find((i: Item) => i.name === 'gold coin') ?? items[0] },
        { x: 59, y: 55, what: items.find((i: Item) => i.name === 'arrow') ?? items[0] },
        { x: 59, y: 55, what: items.find((i: Item) => i.name === 'arrow') ?? items[0] },
    ]
};