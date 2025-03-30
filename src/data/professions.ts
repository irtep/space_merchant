import { Profession } from "../interfaces/sharedInterfaces";

export const professions: Profession[] = [
    {
        name: 'mercenary',
        desc: `Mercenaries are professional soldiers. They excel in combat and military tactics.`,
        stats: {
            strength: 2,
            dexterity: 2,
            toughness: 4,
            perception: 0,
            size: 0,
            magic: 0,
            learning: 0,
            physicalResistance: 5,
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
            },
            {
                name: 'swords',
                level: 1,
                learnPoints: 0,
                desc: 'Special combat skill for sword type of weapons'
            },
            {
                name: 'polearms',
                level: 1,
                learnPoints: 0,
                desc: 'Special combat skill for sword type of weapons'
            },
            {
                name: 'crossbow',
                level: 5,
                learnPoints: 0,
                desc: 'skill to shoot with crossbow.'
            },
            {
                name: 'combat style: weapon and shield',
                level: 5,
                learnPoints: 0,
                desc: 'skill to fight with weapon in other hand and shield in other.'
            },
            {
                name: 'combat style: single weapon',
                level: 1,
                learnPoints: 0,
                desc: 'Special combat skill for sword type of weapons'
            },
            {
                name: 'dodge',
                level: 1,
                learnPoints: 0,
                desc: 'Ability to avoid attacks'
            },
            {
                name: 'parry',
                level: 1,
                learnPoints: 0,
                desc: 'Ability to parry and deflect attacks.'
            }
        ],
        abilities: [
            {
                name: 'first aid',
                desc: `characters in team with holder of this ability regen hit points bit better.`
            }
        ],
    }
];