import { Character } from "../interfaces/sharedInterfaces";
import { smallBase, mediumBase, largeBase } from "../measures/measures";

export const defaultCharacter: Character = {
    id: 'p0',
    title: '',
    name: '',
    race: '',
    profession: '',
    team: '',
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
    endurancePoints: 50,
    armours: {
        head: '',
        neck: '',
        upperBody: '',
        hands: '',
        legs: '',
        feet: ''
    },
    weapons: {
        leftHand: '',
        rightHand: ''
    },
    npc: false,
    aggressive: false,
    status: [],
    active: true,
    enemies: [],
    friends: [],
    canTalk: true,
    action: 'wait',
    actionTarget: '',
    targetLocation: { x: 0, y: 0 },
    inventory: [],
    isPlayer: true,
    selected: false,
    abilities: [],
    skills: [],
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
        armours: {
            head:
            {
                name: 'a steel helmet',
                shortName: 'helmet',
                desc: `A shiny steel helmet with nose protector.`,
                type: 'armour',
                slot: 'head',
                value: 30,
                weight: 1,
                stats: [
                    {
                        stat: 'toughness',
                        value: 1
                    },
                    {
                        stat: 'physical resistance',
                        value: 1
                    }
                ],
                rarity: 'uncommon',
                effects: ['head protected']
            },
            neck: '',
            upperBody:
            {
                name: 'a steel breastplate',
                shortName: 'breastplate',
                desc: `A good looking shiny steel breastplate, that grants fine protections.`,
                type: 'armour',
                slot: 'upperBody',
                value: 50,
                weight: 10,
                stats: [
                    {
                        stat: 'toughness',
                        value: 5
                    },
                    {
                        stat: 'physical resistance',
                        value: 5
                    }
                ],
                rarity: 'uncommon',
                effects: []
            },
            hands: '',
            legs: '',
            feet: '',
        },
        weapons: {
            leftHand:
            {
                name: 'a wooden medium shield',
                shortName: 'shield',
                desc: 'A solid and quite light shield, made of birch.',
                type: 'weapon',
                handlingSkill: 'shields',
                range: 5,
                rangedWeapon: false,
                slotsNeeded: 1,
                value: 3,
                weight: 2.2,
                stats: [],
                combatSpeed: 2,
                effects: ['shield', 'defensive'],
                damage: { physical: 1 },
                coolDownCounter: 0,
                rarity: 'common',
                armourPiercing: 0
            },
            rightHand: {
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
            }
        },
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
        armours: {
            head: '',
            neck: '',
            upperBody: '',
            hands: '',
            legs: '',
            feet: ''
        },
        weapons: {
            leftHand: '',
            rightHand: {
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
            }
        },
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
        abilities: []
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
        armours: {
            head: '',
            neck: '',
            upperBody:
            {
                name: 'an iron breastplate',
                shortName: 'breastplate',
                desc: `A heavy, but should protect you nicely!.`,
                type: 'armour',
                slot: 'upperBody',
                value: 10,
                weight: 20,
                stats: [
                    {
                        stat: 'toughness',
                        value: 1
                    },
                    {
                        stat: 'physical resistance',
                        value: 2
                    }
                ],
                rarity: 'common',
                effects: []
            },
            hands: '',
            legs: '',
            feet: ''
        },
        weapons: {
            leftHand: '',
            rightHand: {
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
            }
        },
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
        abilities: []
    },
];