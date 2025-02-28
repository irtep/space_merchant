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
        size: mediumBase,
        magic: 5,
        abilities: [],
        skills: []
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
    selected: false
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
        location: { x: 150, y: 150 }
    },
    {
        ...clonedDefaultChar,
        id: 'swift1',
        name: 'Mister Assassin',
        race: 'elf',
        profession: 'wizard',
        team: 'enemigos',
        location: { x: 350, y: 450 }
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
            size: smallBase,
            magic: 5,
            abilities: [],
            skills: []
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
            size: largeBase,
            magic: 5,
            abilities: [],
            skills: []
        },
        race: 'ogre',
        profession: 'mercenary',
        team: 'big guns',
        location: { x: 450, y: 123 }
    },
];