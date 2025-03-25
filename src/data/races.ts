import { Race } from "../interfaces/sharedInterfaces";
import { largeBase, mediumBase, smallBase } from "../measures/measures";

// any for now, will be Race[] later
export const races: Race[] = [
    {
        name: 'human',
        desc: `Once most common humanoid and undisputed rulers of the earth. Humans are now constantly fighting for survival in pinch of arguable superior races.
        Without magical abilities, or "inhuman (heh heh)" strength they must rely on their diplomatic skills and fast learning`,
        stats: {
            strength: 10,
            dexterity: 8,
            toughness: 12,
            perception: 5,
            size: mediumBase,
            magic: 0,
            learning: 10,
            physicalResistance: 0,
            magicResistance: 0,
            fireResistance: 0,
            poisonResistance: 0,
            coldResistance: 0,
            psionicResistance: 0
        },
        skills: [
            {
                name: 'close combat',
                level: 1,
                learnPoints: 0,
                desc: 'Things you need to know to survive close combat. Armed and unarmed'
            },
            {
                name: 'ranged combat',
                level: 1,
                learnPoints: 0,
                desc: 'Things you need to know how to use ranged weapons like bows and rifles etc.'
            }
        ],
        abilities: [
            {
                name: 'diplomatic',
                desc: `player character with this skill can accept any races to team.`
            },
            {
                name: 'curious',
                desc: `+2 bonus to learning situations.`
            }
        ],
    },
    {
        name: 'battle android',
        desc: `Solar powered battle android is a fearsome fighter. Originally build by ancient humans to fight wars to them. Battle androids that survived those brutal wars ages ago are now independent inviduals with huge experience and battle skill sets.`,
        stats: {
            strength: 16,
            dexterity: 10,
            toughness: 20,
            perception: 8,
            size: largeBase,
            magic: 0,
            learning: 0,
            physicalResistance: 10,
            magicResistance: 0,
            fireResistance: 25,
            poisonResistance: 100,
            coldResistance: 25,
            psionicResistance: 100
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
                name: 'unarmed combat',
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
    },
    {
        name: 'goblin',
        desc: `A small and agile green skilled race. Curious and natural merchants. Always ready for adventure or haggling.`,
        stats: {
            strength: 5,
            dexterity: 10,
            toughness: 12,
            perception: 9,
            size: smallBase,
            magic: 0,
            learning: 8,
            physicalResistance: 0,
            magicResistance: 0,
            fireResistance: 0,
            poisonResistance: 0,
            coldResistance: 0,
            psionicResistance: 70
        },
        skills: [
            {
                name: 'haggling',
                level: 20,
                learnPoints: 0,
                desc: 'Helps to get better prices when buying and selling'
            },
            {
                name: 'ranged combat',
                level: 1,
                learnPoints: 0,
                desc: 'Things you need to know how to use ranged weapons like bows and rifles etc.'
            },
            {
                name: 'demolitions',
                level: 20,
                learnPoints: 0,
                desc: 'skill to use explosives, mines and traps.'
            }
        ],
        abilities: [
            {
                name: 'merchant',
                desc: 'A natural salesman.'
            },
            {
                name: 'perceptive',
                desc: 'Can see things where other would not.'
            },
            {
                name: 'hyper active',
                desc: `Can't always concentrate on tasks on hand, that causes wild ideas, regulating and fumbling.`
            }
        ],
    },
    {
        name: 'dwarf',
        desc: `Tough, short, bulky. Tough warriors and excellent engineers. One of the most stubborn and arrogant races.`,
        stats: {
            strength: 12,
            dexterity: 6,
            toughness: 20,
            perception: 7,
            size: mediumBase,
            magic: 0,
            learning: 5,
            physicalResistance: 10,
            magicResistance: 50,
            fireResistance: 5,
            poisonResistance: 40,
            coldResistance: 10,
            psionicResistance: 10
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
                name: 'weapon and shield',
                level: 5,
                learnPoints: 0,
                desc: 'skill to fight with weapon and shield combined.'
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
    },
    /*
    {name: 'elf'},
    {name: 'dwarf'},
    {name: 'giant'},
    {name: 'goblin'},
    {name: 'skeleton'},
    {name: 'vampire'},
    {name: 'robot'}
    */
];