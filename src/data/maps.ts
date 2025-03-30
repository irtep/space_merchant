import { GameMap, Item, Weapon } from "../interfaces/sharedInterfaces";
import { items } from "./items";
import { weapons } from "./weapons";

export const jyvaskylaTown: GameMap = {
    rectObstacles: [
        { x: 220, y: 150, w: 210, h: 240, color: 'black', door: { x: 300, y: 150 }, name: 'The Sturdy Oak Tavern' },
        { x: 70, y: 300, w: 190, h: 230, color: 'black', door: { x: 140, y: 300 }, name: 'Blacksmith’s Forge' },
        { x: 500, y: 80, w: 260, h: 300, color: 'black', door: { x: 650, y: 80 }, name: 'The Great Hall of Jyvaskyla' },
        { x: 30, y: 500, w: 300, h: 150, color: 'black', door: { x: 40, y: 500 }, name: 'Harbor Warehouse' },
        { x: 380, y: 480, w: 220, h: 180, color: 'black', door: { x: 450, y: 480 }, name: 'Market Hall' }
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