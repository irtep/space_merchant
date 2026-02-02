import { Character } from "../interfaces/sharedInterfaces";
import { smallBase, mediumBase, largeBase } from "../measures/measures";

export const defaultCharacter: Character = {
    id: 'p0',
    title: '',
    name: '',
    race: '',
    profession: '',
    team: 'npcteam',
        stats: {
            strength: 10,
            dexterity: 8,
            toughness: 12,
            perception: 5,
            size: mediumBase,
            magic: 0,
            learning: 10,
            resists: {
                physical: 0,
                magic: 0,
                fire: 0,
                poison: 0,
                cold: 0,
                psionic: 0
            }
        },
    closeCombat: {
        damage: 0,
        type: ['physical'],
        skill: 'unarmed',
        epCost: 1,
        coolDown: 0,
        coolDownCounter: 0,
        range: 1
    },
    rangedCombat: {
        damage: 0,
        type: ['physical'],
        skill: 'not available',
        epCost: 1,
        coolDown: 0,
        coolDownCounter: 0,
        range: 1
    },
    location: { x: 0, y: 0 },
    world: 'Earth',
    zone: 'Sector 1',
    hitPoints: 100,
    maxHitPoints: 100,
    magicPoints: 50,
    maxMagicPoints: 50,
    endurancePoints: 50,
    maxEndurancePoints: 50,
    equipment: {},
    npc: false,
    aggressive: false,
    status: [],
    active: true,
    enemies: [],
    friends: [],
    canTalk: true,
    action: 'wait',
    actionTarget: null,
    targetLocation: { x: 0, y: 0 },
    inventory: [],
    isPlayer: true,
    selected: false,
    abilities: [],
    skills: [],
    path: []
};

const clonedDefaultChar: Character = JSON.parse(JSON.stringify(defaultCharacter));

export const npcs: Character[] = [
    {
        ...clonedDefaultChar,
        id: 'durk1',
        name: 'Durk Darkhammer',
        race: 'dwarf',
        profession: 'mercenary',
        team: 'amorcitos',
        location: { x: 150, y: 150 },
        stats: {
            strength: 12,
            dexterity: 6,
            toughness: 20,
            perception: 7,
            size: mediumBase,
            magic: 0,
            learning: 5,
            resists: {
                physical: 20,
                magic: 70,
                fire: 20,
                poison: 70,
                cold: 40,
                psionic: 40
            }
        },
        skills: [
            {
                name: 'close combat',
                level: 5,
                learnPoints: 0,
                desc: 'Things you need to know to survive close combat. Armed and unarmed'
            },
            {
                name: 'ranged combat',
                level: 5,
                learnPoints: 0,
                desc: 'Things you need to know how to use ranged weapons like bows and rifles etc.'
            },
            {
                name: 'bludgeons',
                level: 5,
                learnPoints: 0,
                desc: 'weapon skill for blunt weapons like hammers, clubs, maces etc...'
            },
            {
                name: 'axes',
                level: 5,
                learnPoints: 0,
                desc: 'weapon skill for axe weapons'
            },
            {
                name: 'combat style: weapon and shield',
                level: 5,
                learnPoints: 0,
                desc: 'skill to fight with weapon in other hand and shield in other.'
            },
            {
                name: 'crossbow',
                level: 5,
                learnPoints: 0,
                desc: 'skill to shoot with crossbow.'
            },
            {
                name: 'demolitions',
                level: 5,
                learnPoints: 0,
                desc: 'skill to use explosives, mines and traps.'
            }
        ],
        abilities: [
            {
                name: 'arrogant',
                desc: `Arrogant characters learn skills slower.`
            }
        ],
        equipment: {
            head: 'steel-helmet0'
        },
        inventory: [
            {itemId: "pistol-01", quantity: 1},
            {itemId: "steel-breastplate0", quantity: 1},
            {itemId: "hama0", quantity: 1},
            {itemId: "ammo-9mm", quantity: 20},
            {itemId: "bow0", quantity: 1},
            {itemId: "bow1", quantity: 1},
            {itemId: "arrow", quantity: 40}
        ],
        desc: `Badass looking armoured dwarf warrior.`
    },
    {
        ...clonedDefaultChar,
        id: 'swift1',
        name: 'Mister Assassin',
        race: 'elf',
        profession: 'wizard',
        team: 'enemigos',
        stats: {
            ...clonedDefaultChar.stats
        },
        equipment: {},
        location: { x: 350, y: 450 },
        skills: [
            {
                name: 'short blades',
                level: 3,
                learnPoints: 0,
                desc: 'Skill to use short blades like daggers, knives and short sword in combat.'
            },
            {
                name: 'dodge',
                level: 3,
                learnPoints: 0,
                desc: 'Dodge skill helps to avoid getting hit in combat.'
            },
            {
                name: 'close combat',
                level: 1,
                learnPoints: 0,
                desc: 'General skill for close combat.'
            }
        ],
        abilities: [],
        path: []
    },
    {
        ...clonedDefaultChar,
        id: 'cat1',
        name: 'leprecahun',
        race: 'leprechaun',
        profession: 'wizard',
        team: 'enemigos',
        stats: {
            strength: 5,
            dexterity: 10,
            toughness: 12,
            perception: 9,
            size: smallBase,
            magic: 0,
            learning: 8,
            resists: {
                physical: 0,
                magic: 10,
                fire: 10,
                poison: 10,
                cold: 10,
                psionic: 70
            }
        },
        location: { x: 350, y: 22 }
    },
    {
        ...clonedDefaultChar,
        id: 'ogre1',
        name: 'a big ogre',
        equipment: {},
        race: 'ogre',
        profession: 'mercenary',
        team: 'big guns',
        location: { x: 450, y: 123 },
        stats: {
            strength: 16,
            dexterity: 10,
            toughness: 20,
            perception: 8,
            size: largeBase,
            magic: 0,
            learning: 0,
            resists: {
                physical: 10,
                magic: 0,
                fire: 40,
                poison: 100,
                cold: 40,
                psionic: 100
            }
        },
        skills: [
            {
                name: 'close combat',
                level: 10,
                learnPoints: 0,
                desc: 'Things you need to know to survive close combat. Armed and unarmed'
            },
            {
                name: 'ranged combat',
                level: 10,
                learnPoints: 0,
                desc: 'Things you need to know how to use ranged weapons like bows and rifles etc.'
            },
            {
                name: 'combat style: unarmed combat',
                level: 10,
                learnPoints: 0,
                desc: 'How to fight without wielded weapons.'
            },
            {
                name: 'rifles',
                level: 10,
                learnPoints: 0,
                desc: 'Combat skill for rifle type weapons'
            }
        ],
        abilities: [
            {
                name: 'self repair',
                desc: `regens hit points back faster.`
            },
            {
                name: 'steel fists',
                desc: `natural limbs of this invidual are dangerous as weapons`
            }
        ],
        path: []
    },
    {
        ...clonedDefaultChar,
        id: "char-01",
        title: "Captain",
        name: "Hristo",
        race: "Human",
        profession: "Soldier",
        team: "Alpha",
        stats: {
            ...clonedDefaultChar.stats
        },
        location: { x: 0, y: 0 },
        world: "Earth",
        zone: "City",
        hitPoints: 100,
        maxHitPoints: 100,
        magicPoints: 20,
        maxMagicPoints: 20,
        endurancePoints: 50,
        maxEndurancePoints: 50,
        equipment: {},
        inventory: [{itemId: "pistol-01", quantity: 1}],
        npc: false,
        aggressive: false,
        status: [],
        active: true,
        enemies: [],
        friends: [],
        canTalk: true,
        action: "",
        actionTarget: null,
        targetLocation: { x: 0, y: 0 },
        isPlayer: true,
        selected: true,
        abilities: [],
        skills: [],
        path: [],
    }
];