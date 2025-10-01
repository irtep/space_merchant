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
        learning: 0,
        size: mediumBase,
        magic: 5,
        physicalResistance: 0,
        magicResistance: 0,
        fireResistance: 0,
        poisonResistance: 0,
        coldResistance: 0,
        psionicResistance: 0
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
            ...clonedDefaultChar.stats
        },
        equipment: {
            head: 'steel-helmet0'
        },
        inventory: [
            {itemId: "pistol-01", quantity: 1},
            {itemId: "steel-breastplate0", quantity: 1},
            {itemId: "hama0", quantity: 1},
            {itemId: "ammo-9mm", quantity: 20}
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
        name: 'cat',
        race: 'leprechaun',
        profession: 'wizard',
        team: 'enemigos',
        stats: {
            strength: 10,
            dexterity: 8,
            toughness: 12,
            perception: 5,
            learning: 0,
            size: smallBase,
            magic: 5,
            physicalResistance: 0,
            magicResistance: 0,
            fireResistance: 0,
            poisonResistance: 0,
            coldResistance: 0,
            psionicResistance: 0
        },
        location: { x: 350, y: 22 }
    },
    {
        ...clonedDefaultChar,
        id: 'ogre1',
        name: 'a big ogre',
        stats: {
            strength: 10,
            dexterity: 8,
            toughness: 12,
            perception: 5,
            learning: 0,
            size: largeBase,
            magic: 5,
            physicalResistance: 5,
            magicResistance: 0,
            fireResistance: 0,
            poisonResistance: 0,
            coldResistance: 0,
            psionicResistance: 0
        },
        equipment: {},
        race: 'ogre',
        profession: 'mercenary',
        team: 'big guns',
        location: { x: 450, y: 123 },
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
        id: "char-01",
        title: "Captain",
        name: "Hristo",
        race: "Human",
        profession: "Soldier",
        team: "Alpha",
        stats: {
            strength: 10,
            dexterity: 8,
            toughness: 12,
            perception: 5,
            learning: 0,
            size: mediumBase,
            magic: 5,
            physicalResistance: 0,
            magicResistance: 0,
            fireResistance: 0,
            poisonResistance: 0,
            coldResistance: 0,
            psionicResistance: 0
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