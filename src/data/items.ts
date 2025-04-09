import { Item } from "../interfaces/sharedInterfaces";

export const items: Item[] = [
    {
        id: 0, // can default all to 0. real id will get generated
        name: 'gold coin',
        shortName: 'gold coin',
        type: 'money',
        desc: `Gold coins are the most current currency around. Most values are converted to gold coins`,
        value: 1,
        weight: 0.01,
        rarity: 'common'
    },
    {
        id: 0, // can default all to 0. real id will get generated
        name: 'arrow',
        shortName: 'arrow',
        type: 'ammunition',
        desc: `Arrows can be used to bow type of weapons. Wield(equip) the bow, keep arrows in inventory and watch them fly.`,
        value: 0.1,
        weight: 0.01,
        rarity: 'common'
    }
];