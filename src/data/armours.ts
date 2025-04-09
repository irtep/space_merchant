import { Armour } from "../interfaces/sharedInterfaces";

export const armours: Armour[] = [
    {
        id: 0, // can default all to 0. real id will get generated
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
    {
        id: 0, // can default all to 0. real id will get generated
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
    {
        id: 0, // can default all to 0. real id will get generated
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
    }
];