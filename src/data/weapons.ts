import { Weapon } from "../interfaces/sharedInterfaces";

export const weapons: Weapon[] = [
    {
        name: 'an iron dagger',
        shortName: 'dagger',
        desc: 'A basic iron dagger. Fast to use, easy to hide. However short ranged.',
        type: 'weapon',
        handlingSkill: 'short blades',
        range: 5,
        rangedWeapon: false,
        slotsNeeded: 1,
        value: 1,
        weight: 0.01,
        stats: [],
        combatSpeed: 10,
        effects: ['small weapon'],
        damage: { physical: 10 },
        coolDownCounter: 0,
        rarity: 'common',
        armourPiercing: 0
    },
    {
        name: 'a rusted shortsword',
        shortName: 'shortsword',
        desc: 'A time-worn iron shortsword. Slightly better reach than a dagger, but less effective against armor.',
        type: 'weapon',
        handlingSkill: 'short blades',
        range: 10,
        rangedWeapon: false,
        slotsNeeded: 1,
        value: 3,
        weight: 1.2,
        stats: [],
        combatSpeed: 8,
        effects: [],
        damage: { physical: 15 },
        coolDownCounter: 0,
        rarity: 'common',
        armourPiercing: 0
    },
    {
        name: 'a crude iron axe',
        shortName: 'axe',
        desc: 'A rough iron axe with a wooden handle. Powerful but slower than a sword.',
        type: 'weapon',
        handlingSkill: 'axes',
        range: 10,
        rangedWeapon: false,
        slotsNeeded: 1,
        value: 5,
        weight: 2.5,
        stats: [],
        combatSpeed: 7,
        effects: ['chop'],
        damage: { physical: 20 },
        coolDownCounter: 0,
        rarity: 'common',
        armourPiercing: 2
    },
    {
        name: 'a heavy warhammer',
        shortName: 'warhammer',
        desc: 'A brutal iron-headed hammer, slow but devastating against armor.',
        type: 'weapon',
        handlingSkill: 'bludgeons',
        range: 12,
        rangedWeapon: false,
        slotsNeeded: 1,
        value: 8,
        weight: 3.5,
        stats: [],
        combatSpeed: 5,
        effects: ['armor breaker'],
        damage: { physical: 25 },
        coolDownCounter: 0,
        rarity: 'uncommon',
        armourPiercing: 5
    },
    {
        name: 'a simple hunting bow',
        shortName: 'bow',
        desc: 'A lightweight bow, effective at a distance but requires skill to use.',
        type: 'weapon',
        handlingSkill: 'bows',
        range: 100,
        rangedWeapon: true,
        slotsNeeded: 2,
        value: 7,
        weight: 1.8,
        stats: [],
        combatSpeed: 6,
        effects: ['ranged'],
        damage: { physical: 15 },
        coolDownCounter: 0,
        rarity: 'common',
        armourPiercing: 1
    },
    {
        name: 'a chipped spear',
        shortName: 'spear',
        desc: 'A wooden spear with a dull iron tip. Versatile, allowing for thrusts or throws.',
        type: 'weapon',
        handlingSkill: 'polearms',
        range: 20,
        rangedWeapon: false,
        slotsNeeded: 2,
        value: 4,
        weight: 2.0,
        stats: [],
        combatSpeed: 7,
        effects: ['reach'],
        damage: { physical: 18 },
        coolDownCounter: 0,
        rarity: 'common',
        armourPiercing: 1
    },
    {
        name: 'a battered wooden club',
        shortName: 'club',
        desc: 'A simple, heavy wooden club. Crude but effective in a pinch.',
        type: 'weapon',
        handlingSkill: 'bludgeons',
        range: 8,
        rangedWeapon: false,
        slotsNeeded: 1,
        value: 1,
        weight: 1.5,
        stats: [],
        combatSpeed: 9,
        effects: ['blunt force'],
        damage: { physical: 12 },
        coolDownCounter: 0,
        rarity: 'common',
        armourPiercing: 0
    },
    {
        name: 'a jagged iron longsword',
        shortName: 'longsword',
        desc: 'A well-crafted but slightly worn longsword. Balanced and deadly in the right hands.',
        type: 'weapon',
        handlingSkill: 'long blades',
        range: 12,
        rangedWeapon: false,
        slotsNeeded: 1,
        value: 10,
        weight: 2.2,
        stats: [],
        combatSpeed: 7,
        effects: [],
        damage: { physical: 22 },
        coolDownCounter: 0,
        rarity: 'uncommon',
        armourPiercing: 2
    }
];
