import { GameMap, Item, Weapon } from "../interfaces/sharedInterfaces";
import { items } from "./items";
import { weapons } from "./weapons";

export const jyvaskylaTown: GameMap = {
    rectObstacles: [
        { x: 22, y: 15, w: 2, h: 2, color: 'black', door: { x: 30, y: 15 }, name: 'The Sturdy Oak Tavern' },
        { x: 7, y: 30, w: 1, h: 2, color: 'black', door: { x: 14, y: 30 }, name: 'Blacksmith’s Forge' },
        { x: 17, y: 16, w: 2, h: 3, color: 'black', door: { x: 65, y: 8 }, name: 'The Great Hall of Jyvaskyla' },
        { x: 3, y: 16, w: 3, h: 1, color: 'black', door: { x: 4, y: 50 }, name: 'Harbor Warehouse' },
        { x: 20, y: 11, w: 2, h: 1, color: 'black', door: { x: 45, y: 48 }, name: 'Market Hall' }
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